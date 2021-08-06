import { Heading } from '@chakra-ui/react';
import { usePostsQuery } from '../generated/graphql';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { Navbar } from '../components/Navbar';

const Index = () => {
  const [{ data, fetching, error }] = usePostsQuery();

  return (
    <Container height="100vh">
      <Navbar />
      <Main>
        <Heading as="h1">Hello World!</Heading>
        <br />
        {fetching && <div>Loading...</div>}
        {data && (
          <div>
            {data.posts.map((post) => (
              <Heading as="h5">{post.title}</Heading>
            ))}
          </div>
        )}
      </Main>

      <DarkModeSwitch />
    </Container>
  );
};

export default Index;
