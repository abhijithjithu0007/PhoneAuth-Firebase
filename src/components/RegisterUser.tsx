import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";
import toast from "react-hot-toast";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import FormField from "./Formfield";
import { clearUserDetails } from "../feature/registerSlice";
import { setAuthenticated } from "../feature/authSlice";
import { regValidationSchema } from "../utils/regSchema";
import { RootState } from "../store";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  agreeTerms: boolean;
}

const RegisterUser: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { phone } = useSelector((state: RootState) => state.auth);

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    agreeTerms: false,
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      const userId = Date.now().toString();
      await setDoc(doc(db, "users", userId), {
        ...values,
        phone,
      });

      dispatch(clearUserDetails());
      dispatch(setAuthenticated(true));
      toast.success("User registered successfully!");
      navigate("/profile");
    } catch (error: any) {
      console.error(error);
      toast.error("Error registering user");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex max-w-6xl w-full bg-white">
        <div className="w-1/2 hidden sm:block">
          <img
            src="/assets/signup.png"
            alt="Sign Up"
            className="w-4/5 rounded-l-lg p-10 h-screen"
          />
        </div>

        <div className="w-full sm:w-1/2 p-6 mt-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Sign Up</h2>
          <p className="text-gray-600 mb-6">
            Let's get you all set up so you can access your personal account
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={regValidationSchema()}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    name="firstName"
                    placeholder="Enter your first name"
                  />
                  <FormField
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter your last name"
                  />
                </div>
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                />

                <div className="flex items-center space-x-2">
                  <Field
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    className="mr-2"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                    I agree to all <span className="text-red-500">Terms</span>{" "}
                    and <span className="text-red-500">Privacy Policies</span>
                  </label>
                  <ErrorMessage
                    name="agreeTerms"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isSubmitting ? "Creating.." : "Create account"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
