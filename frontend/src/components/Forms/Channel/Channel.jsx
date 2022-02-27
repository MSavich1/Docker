import { Form, Field, ErrorMessage, FastField } from "formik";
import TextError from '../TextError/TextError';
import { validateComments } from '../../../utils/ValidateComments';
import * as Yup from "yup";


const validationSchema = Yup.object({
    channel: Yup.string().required("Required"),
  });


export const Channel = (props) => {
  const { microform: Microform } = props;

  return (
    <Microform 
    name="channel"
    options={{
        initialValues: {
            channel: "",
            comments: "",
            address: "",
          },
          validationSchema,

    }}>
      {() => {
        return (
          <Form>
            <div className="form-control">
              <label htmlFor="channel">Channel</label>
              <Field
                type="text"
                id="channel"
                name="channel"
                placeholder={"Channel name"}
              />
              <ErrorMessage name="channel" component={TextError} />
            </div>

            <div className="form-control">
              <label htmlFor="comments">Comments</label>
              <Field
                as="textarea"
                id="comments"
                name="comments"
                validate={validateComments}
              />
              <ErrorMessage name="comments" component={TextError} />
            </div>

            <div className="form-controll">
              <label htmlFor="address">Address</label>
              <FastField name="address">
                {(props) => {
                  console.log("Field render");
                  const { field, form, meta } = props;

                  return (
                    <div>
                      <input type="text" id="address" {...field} />
                      {meta.touched && meta.error ? (
                        <div>{meta.error}</div>
                      ) : null}
                    </div>
                  );
                }}
              </FastField>
            </div>
          </Form>
        );
      }}
    </Microform>
  );
};
