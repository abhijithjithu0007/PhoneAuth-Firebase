import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtp } from "../feature/authSlice";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { doc, query, where, collection, getDocs } from "firebase/firestore";
import { ConfirmationResult, getAuth, onAuthStateChanged } from "firebase/auth";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

interface RootState {
  auth: {
    otp: string;
    confirmationResult: ConfirmationResult | null;
    phone: string;
  };
}

const VerifyOtp = () => {
  const { otp, confirmationResult, phone } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be exactly 6 digits")
      .matches(/^\d+$/, "OTP must contain only digits")
      .required("OTP is required"),
  });

  const verifyOtp = async (values: { otp: string }) => {
    try {
      if (!confirmationResult) {
        return;
      }

      setLoading(true);

      const result = await confirmationResult.confirm(values.otp);

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("phone", "==", phone));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            navigate("/profile");
          } else {
            const userRef = doc(db, "users", result.user.uid);
            toast.success("Phone number registered successfully!");
            navigate("/register");
          }
        } else {
          toast.error("Please log in first.");
        }
      });
    } catch (error) {
      console.error("Error verifying OTP: ", error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      <div className="max-w-5xl w-full bg-white flex flex-col sm:flex-row justify-between items-center p-4">
        <div className="w-full sm:w-1/2 p-4">
          <img src="/assets/logo.png" alt="" />
          <div className="mt-20">
            <Link to={"/"}>
              <img
                src="/assets/backlogin.png"
                alt=""
                className="cursor-pointer"
              />
            </Link>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mt-6">Verify Code</h2>
          <p className="text-base text-gray-600 mt-4">
            A verification code has been sent to your phone number.
          </p>

          <Formik
            initialValues={{ otp: otp }}
            validationSchema={validationSchema}
            onSubmit={(values) => verifyOtp(values)}
          >
            <Form>
              <div className="mt-6 relative flex items-center">
                <Field
                  type="text"
                  name="otp"
                  placeholder=" "
                  className="w-full pl-4 pr-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                />
                <label
                  htmlFor="otp"
                  className="absolute left-8 -top-4 p-1 text-gray-500 text-sm bg-white"
                >
                  Enter Code
                </label>
              </div>

              <div className="text-red-500 mt-2">
                <ErrorMessage name="otp" component="div" />
              </div>

              <div className="mt-6">
                <p>
                  Didn't receive code?
                  <span className="text-red-500">Resend</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2 mt-6 bg-blue-600 text-white rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin border-t-2 border-gray-200 rounded-full w-5 h-5"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </Form>
          </Formik>
        </div>

        <div className="hidden sm:block w-1/2 p-4">
          <img
            src="/assets/verify.png"
            alt="Verify OTP illustration"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
