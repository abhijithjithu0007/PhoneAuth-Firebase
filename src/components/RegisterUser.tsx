import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { clearUserDetails } from "../feature/registerSlice";
import { setAuthenticated } from "../feature/authSlice";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  agreeTerms: boolean;
}

const RegisterUser: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const phone = localStorage.getItem("phoneNumber") || "";

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    agreeTerms: Yup.bool().oneOf(
      [true],
      "You must agree to the terms and conditions."
    ),
  });

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    const { firstName, lastName, email, agreeTerms } = values;

    if (!firstName || !lastName || !email || !agreeTerms) {
      setSubmitting(false);
      return;
    }

    try {
      const userId = Date.now().toString();

      await setDoc(doc(db, "users", userId), {
        firstName,
        lastName,
        email,
        phone,
      });

      dispatch(clearUserDetails());
      dispatch(setAuthenticated(true));
      toast.success("User registered successfully!");
      localStorage.setItem("isLogin", JSON.stringify(true));
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
            alt=""
            className="w-4/5 rounded-l-lg p-10 h-screen"
          />
        </div>

        <div className="w-full sm:w-1/2 p-6 mt-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Sign Up</h2>
          <p className="text-gray-600 mb-6">
            Let's get you all set up so you can access your personal account
          </p>

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              agreeTerms: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <Field
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <Field
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex-col items-center p-5">
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

                  <div className="text-red-500 text-sm mt-2">
                    <ErrorMessage name="agreeTerms" component="div" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isSubmitting ? "Creating.." : "Create account"}
                </button>
                <p className="text-center p-3">
                  Already have an account?{" "}
                  <span className="text-red-500 cursor-pointer">Login</span>
                </p>

                <div className="flex items-center my-4 gap-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
