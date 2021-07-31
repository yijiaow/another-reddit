import React from 'react';
import NextLink from 'next/link';
import { Flex, Box, Link } from '@chakra-ui/react';

import { useMeQuery } from '../generated/graphql';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching, error }] = useMeQuery();

  if (fetching) return null;

  if (!data?.me)
    return (
      <Flex p={5}>
        <Box>
          <NextLink href="/login">
            <Link mr={2}>Log In</Link>
          </NextLink>
          <NextLink href="/register">
            <Link>Register</Link>
          </NextLink>
        </Box>
      </Flex>
    );

  if (data.me)
    return (
      <Flex p={5}>
        <Box>
          <NextLink href="/logout">
            <Link>Log out</Link>
          </NextLink>
        </Box>
      </Flex>
    );
};
