import { useState } from "react";
import axios from "axios";
import { Form, Field, ErrorMessage } from "formik";
import TextError from "../Forms/TextError/TextError";
import { useMicroform } from "../../utils/microFormik";
import { createValidationSchema } from "../../utils/createValidationSchema";

const form = {
  display: "flex",
  flexDirection: "column",
  width: "300px",
  margin: "0 auto",
};
const field = { padding: "10px 0px", margin: "10px 0" };

export const Login = ({ setAuth }) => {
  const { MicroformContext, Microform, microformsControl } = useMicroform();
  const [errorAuth, setErrorAuth] = useState(false);
  const [validName, setValidName] = useState(true);

  const authRequest = async (email, password) => {
    try {
      const { data } = await axios.post("api/sign-in", {
        email: email,
        password: password,
      });

      if (data.error) {
        setErrorAuth(errorAuth);
        throw data.error;
      }
      return data;
    } catch (err) {
      setErrorAuth(err);
    }
  };

  const onSubmit = async (values) => {
    try {
      const token = await authRequest(values.email, values.password);

      if (token) {
        localStorage.setItem("token", token);
        setAuth(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validateName = (value) => {
    if (value === "required") {
      setValidName(true);
    } else {
      setValidName(false);
    }
  };

  return (
    <>
      {" "}
      <h1>Login: admin@mail.ru</h1>
      <h2>Password: 1234qwer</h2>
      <MicroformContext>
        <Microform
          name="login"
          options={{
            initialValues: {
              theme: "required",
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            },
            onSubmit,
            validationSchema: createValidationSchema(validName),
          }}
        >
          {(formikProps) => {
            return (
              <Form style={form}>
                <Field as="select" name="theme">
                  <option value="required">Required name</option>
                  <option value="notRequired">Not required name</option>
                </Field>
                <div>
                  <Field
                    style={field}
                    type="text"
                    name="name"
                    placeholder="Name"
                    validate={() => validateName(formikProps.values.theme)}
                  />
                  <ErrorMessage name="name" component={TextError} />
                </div>
                <div>
                  <Field
                    style={field}
                    type="email"
                    name="email"
                    placeholder="Email"
                  />
                  <ErrorMessage name="email">
                    {(errorMsg) => <div className="error">{errorMsg}</div>}
                  </ErrorMessage>
                </div>
                <div>
                  <Field
                    style={field}
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" component={TextError} />
                </div>

                <div>
                  <Field
                    style={field}
                    type="password"
                    name="confirmPassword"
                    placeholder="confirmPassword"
                  />
                  <ErrorMessage name="confirmPassword" component={TextError} />
                </div>
                <button type="submit" onClick={() => console.log(formikProps)}>
                  Log in
                </button>
              </Form>
            );
          }}
        </Microform>
      </MicroformContext>
      <TextError>{errorAuth}</TextError>
    </>
  );
};
