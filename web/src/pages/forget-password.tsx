import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { useForgetPasswordMutation } from '../generated/graphql';
import { Container } from '../components/Container';
import { InputField } from '../components/InputField';

interface forgetPasswordProps {}

const forgetPassword: React.FC<forgetPasswordProps> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, useForgetPassword] = useForgetPasswordMutation();

  const handleSubmit = async (values) => {
    const response = await useForgetPassword(values);
    setComplete(true);
  };

  return (
    <Container>
      <Formik initialValues={{ email: '' }} onSubmit={handleSubmit}>
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              We have sent you an email with password reset instructions if an account associated with that email
              address exists.
            </Box>
          ) : (
            <Form>
              <Box>
                <InputField label="Email" name="email" type="email" />
              </Box>
              <Button
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
                mt={4}
              >
                Send Email
              </Button>
            </Form>
          )
        }
      </Formik>
    </Container>
  );
};

export default forgetPassword;
