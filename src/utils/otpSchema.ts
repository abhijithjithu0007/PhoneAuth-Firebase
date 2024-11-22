import * as Yup from "yup";

export const otpValidationSchema = (otp: string) =>
  Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be exactly 6 digits")
      .matches(/^\d+$/, "OTP must contain only digits")
      .required("OTP is required"),
  });

export const validationSchema = (firstName, lastName, email, agreeTerms) =>
  Yup.object({
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
