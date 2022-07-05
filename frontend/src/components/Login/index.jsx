import { useState } from "react";
import axios from "axios";
import { Form, Field, ErrorMessage } from "formik";
import style from "./Login.module.css";
import TextError from "../Forms/TextError/index";
import { useMicroform } from "../../utils/microFormik";
import { createValidationSchema } from "../../utils/createValidationSchema";
import { API_SIGN_IN, REQUIRED, NOTREQUIRED, TOKEN } from "../../constants";

export const Login = ({ setAuth }) => {
  const { MicroformContext, Microform } = useMicroform();
  const [errorAuth, setErrorAuth] = useState(false);
  const [validName, setValidName] = useState(true);

  const authRequest = async (email, password) => {
    try {
      const { data } = await axios.post(API_SIGN_IN, {
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
      const { email, password } = values;

      const token = await authRequest(email, password);

      if (token) {
        localStorage.setItem(TOKEN, token);
        setAuth(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validateName = (value) => {
    if (value === REQUIRED) {
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
              theme: REQUIRED,
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
              <Form className={style.form}>
                <Field as="select" name="theme">
                  <option value={REQUIRED}>Required name</option>
                  <option value={NOTREQUIRED}>Not required name</option>
                </Field>
                <div>
                  <Field
                    className={style.field}
                    type="text"
                    name="name"
                    placeholder="Name"
                    validate={() => validateName(formikProps.values.theme)}
                  />
                  <ErrorMessage name="name" component={TextError} />
                </div>
                <div>
                  <Field
                    className={style.field}
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
                    className={style.field}
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" component={TextError} />
                </div>

                <div>
                  <Field
                    className={style.field}
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
