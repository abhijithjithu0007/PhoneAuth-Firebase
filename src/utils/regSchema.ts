import * as Yup from "yup";

export const regValidationSchema = () =>
  Yup.object({
    firstName: Yup.string()
      .required("First Name is required")
      .min(2, "First Name must be at least 2 characters long"),
    lastName: Yup.string()
      .required("Last Name is required")
      .min(2, "Last Name must be at least 2 characters long"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    agreeTerms: Yup.boolean().oneOf(
      [true],
      "You must agree to the terms and conditions."
    ),
  });
