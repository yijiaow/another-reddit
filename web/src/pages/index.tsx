import { Heading } from '@chakra-ui/react';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { Navbar } from '../components/Navbar';

const Index = () => (
  <Container height="100vh">
    <Navbar />
    <Main>
      <Heading as="h1">Hello World!</Heading>
    </Main>

    <DarkModeSwitch />
  </Container>
);

export default Index;
