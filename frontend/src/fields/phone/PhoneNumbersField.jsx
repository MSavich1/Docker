import { Field, FieldArray, ErrorMessage } from "formik";
import TextError from "../../components/Forms/TextError"
import { PHNUMBERS } from "../../constants";

export const PhoneNumbersField = () => {
    return (
        <div className="form-control">
              <label>List of phone numbers</label>
              <FieldArray name={PHNUMBERS}>
                {(fieldArrayProps) => {
                  const { push, remove, form } = fieldArrayProps;
                  const { values } = form;
                  const { phNumbers } = values;
                  return (
                    <div>
                      {phNumbers.map((phNumber, index) => (
                          
                        <div key={index} style={{ display: "flex" }}>
                            {console.log(form)}
                          <Field type="text" name={`${PHNUMBERS}[${index}]`} />
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
                              name={`${PHNUMBERS}[${index}]`}
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
    )
}