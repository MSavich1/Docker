import { FastField } from "formik";
import TextError from "../../components/Forms/TextError";

export const AddressField = ({address}) => {

  return (
    <div className="form-controll">
      <label htmlFor={address}>Address</label>
      <FastField name={address}>
        {(props) => {
          const { field, meta } = props;

          return (
            <div>
              <input type="text" id={address} {...field} />
              {meta.touched && meta.error ? (
                <TextError>{meta.error}</TextError>
              ) : null}
            </div>
          );
        }}
      </FastField>
    </div>
  );
};
