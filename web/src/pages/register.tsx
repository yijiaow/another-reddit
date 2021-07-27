import React from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { InputField } from '../components/InputField';

interface registerProps {}

interface Values {
  username: string;
  password: string;
}

const Register: React.FC<registerProps> = ({}) => {
  const handleSubmit = async (values, actions) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      actions.setSubmitting(false);
    }, 1000);
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={handleSubmit}
    >
      {(props: FormikProps<Values>) => (
        <Form>
          <InputField label="Username" name="username" />
          <InputField label="Password" name="password" type="password" />
        </Form>
      )}
    </Formik>
  );
};

export default Register;
