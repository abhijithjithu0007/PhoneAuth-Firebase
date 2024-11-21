import * as Yup from "yup";

export const otpValidationSchema = (otp: string) =>
  Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be exactly 6 digits")
      .matches(/^\d+$/, "OTP must contain only digits")
      .required("OTP is required"),
  });
