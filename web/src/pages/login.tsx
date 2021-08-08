import React from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Formik, Form } from 'formik';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
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
      typeof router.query.next === 'string'
        ? router.push(router.query.next)
        : router.push('/');
    }
  };

  return (
    <Container>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box>
              <InputField label="Username / Email" name="usernameOrEmail" />
            </Box>

            <Box>
              <InputField label="Password" name="password" type="password" />
            </Box>
            <Flex mt={2}>
              <NextLink href="/forget-password">
                <Link>Forget Password?</Link>
              </NextLink>
            </Flex>
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
