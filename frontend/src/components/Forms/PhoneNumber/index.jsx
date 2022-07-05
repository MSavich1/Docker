import * as Yup from "yup";
import { Form, Field, ErrorMessage } from "formik";

import TextError from "../TextError/index";
import { createNumberValidate } from "../../../utils/phoneValidate";
import { PHONENUMBER, PHONENUMBERS, PRIMARYPH, SECONDARYPH } from "../../../constants";
import { PhoneNumbersField } from '../../../fields/phone/PhoneNumbersField';

const validationSchema = Yup.object({
  phoneNumbers: Yup.array().of(createNumberValidate()),
  phNumbers: Yup.array().of(createNumberValidate()),
});

export const PhoneNumber = (props) => {
  const { microform: Microform } = props;

  return (
    <Microform
      name={PHONENUMBER}
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
              <label htmlFor={PRIMARYPH}>Primary phone number</label>
              <Field type="text" id={PRIMARYPH} name={`${PHONENUMBERS}[0]`}/>
              <ErrorMessage name={`${PHONENUMBERS}[0]`} component={TextError} />
            </div>

            <div className="form-control">
              <label htmlFor={SECONDARYPH}>Secondary phone number</label>
              <Field type="text" id={SECONDARYPH} name={`${PHONENUMBERS}[1]`} />
              <ErrorMessage name={`${PHONENUMBERS}[1]`} component={TextError} />
            </div>

            <PhoneNumbersField />            
          </Form>
        );
      }}
    </Microform>
  );
};
