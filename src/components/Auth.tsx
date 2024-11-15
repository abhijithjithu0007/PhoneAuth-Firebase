import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  setPhone,
  setConfirmationResult,
  setLoading,
} from "../feature/authSlice";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

//phone auth component

const Auth = () => {
  const dispatch = useDispatch();
  const phone = useSelector(
    (state: { auth: { phone: string } }) => state.auth.phone
  );
  const loading = useSelector(
    (state: { auth: { loading: boolean } }) => state.auth.loading
  );
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState(phone);

  useEffect(() => {
    setPhoneNumber(phone);
  }, [phone]);

  const phoneSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  });

  const sendOtp = async (values: any) => {
    try {
      dispatch(setLoading(true));

      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
      await recaptchaVerifier.render();

      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${values.phoneNumber}`,
        recaptchaVerifier
      );

      dispatch(setConfirmationResult(confirmation));
      toast.success("OTP sent to your phone.");
      localStorage.setItem("phoneNumber", values.phoneNumber);
      navigate("/verify");
    } catch (error: any) {
      toast.error("Error sending OTP: ");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePhoneChange = (value: string) => {
    const formattedValue = `+91${value.replace(/^\+91/, "")}`;
    setPhoneNumber(formattedValue);
    dispatch(setPhone(formattedValue));
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      <div className="max-w-5xl w-full bg-white flex justify-around">
        <div className="w-full sm:w-1/2 p-4">
          <img src="/assets/logo.png" alt="Logo" />
          <h2 className="text-5xl font-semibold text-gray-800 mt-14">Login</h2>
          <p className="text-base text-gray-600 mt-4">
            Login to access your Travel Wise account
          </p>

          <Formik
            initialValues={{ phoneNumber: phoneNumber.replace(/^\+91/, "") }}
            validationSchema={phoneSchema}
            onSubmit={sendOtp}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="mt-6 relative flex flex-col items-start">
                  <span className="absolute left-4 top-2 text-md text-gray-500 select-none">
                    +91
                  </span>
                  <Field
                    type="text"
                    name="phoneNumber"
                    placeholder=" "
                    className="w-full pl-12 pr-4 py-2 border border-blue-500 rounded-md focus:outline-none "
                  />
                  <label
                    htmlFor="phoneNumber"
                    className="absolute left-8 -top-4 text-gray-500 text-sm bg-white p-1"
                  >
                    Phone Number
                  </label>

                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-500 text-sm mt-2 w-full"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 mt-6 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center" // Added flex and centering
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex justify-center items-center space-x-2">
                      <div className="animate-spin border-t-2 border-gray-200 rounded-full w-5 h-5"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send OTP"
                  )}
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

        <div className="hidden sm:block w-1/2">
          <img
            src="/assets/loginImg.png"
            alt="Login illustration"
            className="w-full h-full p-10"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
