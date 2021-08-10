import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Formik, Form } from 'formik';
import { Box, Button, Flex, FormErrorMessage, Link } from '@chakra-ui/react';
import { useChangePasswordMutation } from '../../generated/graphql';
import { Container } from '../../components/Container';
import { InputField } from '../../components/InputField';
import { toErrorMap } from '../../utils/toErrorMap';

interface ChangePasswordProps {
  token: string;
}

export const ChangePassword: NextPage<ChangePasswordProps> = ({ token }) => {
  const router = useRouter();
  const [tokenError, setTokenError] = useState('');
  const [, changePassword] = useChangePasswordMutation();

  const handleSubmit = async (values, { setErrors }) => {
    const response = await changePassword({
      token,
      newPassword: values.newPassword,
    });

    if (response.data.changePassword.errors) {
      const errorMap = toErrorMap(response.data.changePassword.errors);
      setErrors(errorMap);

      if ('token' in errorMap) {
        setTokenError(errorMap['token']);
      }
    } else {
      router.push('/');
    }
  };

  return (
    <Container variant="sm">
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box>
              <InputField
                label="New Password"
                name="newPassword"
                type="password"
              />
            </Box>
            {tokenError && (
              <Flex mt={2}>
                <FormErrorMessage>{tokenError}</FormErrorMessage>
                <NextLink href="/forget-password">
                  <Link>Resend token</Link>
                </NextLink>
              </Flex>
            )}
            <Button
              type="submit"
              isLoading={isSubmitting}
              isFullWidth={true}
              colorScheme="teal"
              mt={4}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

ChangePassword.getInitialProps = (context) => {
  return {
    token: context.query.token as string,
  };
};

export default ChangePassword;
