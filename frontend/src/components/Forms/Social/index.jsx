import { Form, Field } from "formik";

export const Social = (props) => {
  const { microform: Microform } = props;

  return (
    <Microform
      name="social"
      options={{
        initialValues: {
          social: {
            facebook: "",
            twitter: "",
          },
        },
        onSubmit: (values) => {
          console.log("channel", values);
        },
      }}
    >
      {() => {
        return (
          <Form>
            <div className="form-control">
              <label htmlFor="facebook">Facebook profile</label>
              <Field type="text" id="facebook" name="social.facebook" />
            </div>

            <div className="form-control">
              <label htmlFor="twitter">Twitter profile</label>
              <Field type="text" id="twitter" name="social.twitter" />
            </div>
          </Form>
        );
      }}
    </Microform>
  );
};
