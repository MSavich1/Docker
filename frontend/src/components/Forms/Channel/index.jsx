import * as Yup from "yup";
import { Form, Field, ErrorMessage } from "formik";
import TextError from "../TextError/index";

import { validateComments } from "../../../utils/ValidateComments";
import { AddressField } from "../../../fields/address/AddressField";
import { ADDRESS, CHANNEL, COMMENTS, REQUIRED } from "../../../constants";

const validationSchema = Yup.object({
  channel: Yup.string().required(REQUIRED),
  comments: Yup.string().required(REQUIRED),
  address: Yup.string().required(REQUIRED),
});

export const Channel = (props) => {
  const { microform: Microform } = props;

  return (
    <Microform
      name={CHANNEL}
      options={{
        initialValues: {
          channel: "",
          comments: "",
          address: "",
        },
        validationSchema,
      }}
    >
      {() => {
        return (
          <Form>
            <div className="form-control">
              <label htmlFor="channel">Channel</label>
              <Field
                type="text"
                id={CHANNEL}
                name={CHANNEL}
                placeholder={"Channel name"}
              />
              <ErrorMessage name={CHANNEL} component={TextError} />
            </div>

            <div className="form-control">
              <label htmlFor={COMMENTS}>Comments</label>
              <Field
                as="textarea"
                id={COMMENTS}
                name={COMMENTS}
                validate={validateComments}
              />
              <ErrorMessage name={COMMENTS} component={TextError} />
            </div>

            <AddressField address={ADDRESS} />
          </Form>
        );
      }}
    </Microform>
  );
};
