import * as Yup from "yup";


export const createValidationSchema = (withName) =>
  Yup.object({
    name: withName
      ? Yup.string()
          .matches(/^[A-Za-z ]*$/, "Please enter valid name")
          .max(40)
          .min(3)
          .required()
      : Yup.string().optional(),
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string()
      .required("No password provided.")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
  });
