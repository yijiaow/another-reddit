import React from 'react';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { useLoginMutation } from '../generated/graphql';
import { Container } from '../components/Container';
import { InputField } from '../components/InputField';
import { toErrorMap } from '../utils/toErrorMap';

interface loginProps {}
const login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  const handleSubmit = async (values, { setErrors }) => {
    const response = await login(values);

    if (response.data.login.errors) {
      setErrors(toErrorMap(response.data.login.errors));
    } else if (response.data.login.user) {
      router.push('/');
    }
  };

  return (
    <Container>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box>
              <InputField label="Username" name="username" />
            </Box>

            <Box>
              <InputField label="Password" name="password" type="password" />
            </Box>
            <Button
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
              mt={4}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default login;
