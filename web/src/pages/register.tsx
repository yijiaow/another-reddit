import React from 'react';
import { useMutation } from 'urql';
import { Formik, Form, FormikProps } from 'formik';
import { InputField } from '../components/InputField';

const REGISTER = `
  mutation Register($username: String!, $password: String!) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
`;

interface registerProps {}

interface Values {
  username: string;
  password: string;
}

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER);

  const handleSubmit = async (values, actions) => {
    const response = await register(values);
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
