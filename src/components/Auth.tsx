import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { auth } from "../firebaseConfig";
import {
  setPhone,
  setConfirmationResult,
  setLoading,
  setRecaptchaVerifier,
} from "../feature/authSlice";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { phone, loading, recaptchaVerifier } = useSelector(
    (state: any) => state.auth
  );

  useEffect(() => {
    if (!recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      verifier.render().catch((error) => {
        toast.error("Error initializing Recaptcha");
      });
      dispatch(setRecaptchaVerifier(verifier));
    }
  }, [dispatch, recaptchaVerifier]);

  const phoneSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  });

  const sendOtp = async (values: any) => {
    try {
      dispatch(setLoading(true));
      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${values.phoneNumber}`,
        recaptchaVerifier
      );

      dispatch(setPhone(`+91${values.phoneNumber}`));

      dispatch(setConfirmationResult(confirmation));
      toast.success("OTP sent to your phone.");
      localStorage.setItem("phoneNumber", "+91" + values.phoneNumber);
      navigate("/verify");
    } catch (error: any) {
      toast.error(
        `Error sending OTP: ${error.message || "Unknown error occurred"}`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      <div className="max-w-5xl w-full bg-white flex justify-around items-center">
        <div className="w-full sm:w-1/2 p-4">
          <h2 className="text-5xl font-semibold text-gray-800 mt-14">Login</h2>
          <p className="text-base text-gray-600 mt-4">
            Login to access your Travel Wise account
          </p>

          <Formik
            initialValues={{ phoneNumber: phone.replace(/^\+91/, "") }}
            validationSchema={phoneSchema}
            onSubmit={sendOtp}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="mt-6 relative flex flex-col items-start">
                  <Field
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    className="w-full px-4 py-2 border border-blue-500 rounded-md focus:outline-none"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 mt-6 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}
          </Formik>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to={"/register"}>
              <span className="text-red-400 cursor-pointer">Signup</span>
            </Link>
          </p>
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
