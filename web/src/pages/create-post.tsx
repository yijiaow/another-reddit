import React from 'react';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { useCreatePostMutation } from '../generated/graphql';
import { Container } from '../components/Container';
import { InputField } from '../components/InputField';

interface createPostProps {}

export const createPost: React.FC<createPostProps> = ({}) => {
  const router = useRouter();
  const [, createPost] = useCreatePostMutation();

  const handleSubmit = async (values) => {
    const response = await createPost(values);

    if (response.error) {
      console.error(response.error);
    } else {
      router.push('/');
    }
  };

  return (
    <Container>
      <Formik initialValues={{ title: '' }} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Box>
              <InputField label="Title" name="title" />
            </Box>
            <Button
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
              mt={4}
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default createPost;
