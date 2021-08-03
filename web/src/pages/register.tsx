import React from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, FormikProps } from 'formik';
import { useRegisterMutation } from '../generated/graphql';
import { InputField } from '../components/InputField';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {}

interface Values {
  email: string;
  username: string;
  password: string;
}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const response = await register(values);

    setSubmitting(false);

    if (response.data.register.errors) {
      setErrors(toErrorMap(response.data.register.errors));
    } else if (response.data.register.user) {
      router.push('/');
    }
  };

  return (
    <Formik
        initialValues={{ email: '', username: '', password: '' }}
      onSubmit={handleSubmit}
    >
      {(props: FormikProps<Values>) => (
        <Form>
            <Box>
              <InputField label="Email" name="email" type="email" />
            </Box>
            <Box>
          <InputField label="Username" name="username" />
          <InputField label="Password" name="password" type="password" />
        </Form>
      )}
    </Formik>
  );
};

export default Register;
