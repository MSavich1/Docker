import * as Yup from "yup";
import { Form, Field, FieldArray, ErrorMessage } from "formik";

import TextError from "../TextError/TextError";
import { createNumberValidate } from "../../../utils/phoneValidate";

const validationSchema = Yup.object({
  phoneNumbers: Yup.array().of(createNumberValidate()),
  phNumbers: Yup.array().of(createNumberValidate()),
});

export const PhoneNumber = (props) => {
  const { microform: Microform } = props;

  return (
    <Microform
      name="phoneNumber"
      options={{
        initialValues: {
          phoneNumbers: ["", ""],
          phNumbers: [""],
        },
        validationSchema,
      }}
    >
      {() => {
        return (
          <Form>
            <div className="form-control">
              <label htmlFor="primaryPh">Primary phone number</label>
              <Field type="text" id="primaryPh" name="phoneNumbers[0]" />
              <ErrorMessage name="phoneNumbers[0]" component={TextError} />
            </div>

            <div className="form-control">
              <label htmlFor="secondaryPh">Secondary phone number</label>
              <Field type="text" id="secondaryPh" name="phoneNumbers[1]" />
              <ErrorMessage name="phoneNumbers[1]" component={TextError} />
            </div>

            <div className="form-control">
              <label>List of phone numbers</label>
              <FieldArray name="phNumbers">
                {(fieldArrayProps) => {
                  const { push, remove, form } = fieldArrayProps;
                  const { values } = form;
                  const { phNumbers } = values;
                  console.log(phNumbers);
                  console.log(Boolean(!form.errors.phNumbers), form.errors);
                  return (
                    <div>
                      {phNumbers.map((phNumber, index) => (
                        <div key={index} style={{ display: "flex" }}>
                          <Field type="text" name={`phNumbers[${index}]`} />
                          {index > 0 && (
                            <button type="button" onClick={() => remove(index)}>
                              {" "}
                              -{" "}
                            </button>
                          )}
                          {Boolean(!form.errors.phNumbers) && (
                            <button type="button" onClick={() => push("")}>
                              {" "}
                              +{" "}
                            </button>
                          )}
                          <div>
                            <ErrorMessage
                              name={`phNumbers[${index}]`}
                              component={TextError}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }}
              </FieldArray>
            </div>
          </Form>
        );
      }}
    </Microform>
  );
};
