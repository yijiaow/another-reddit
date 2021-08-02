import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { MeDocument } from '../generated/graphql';
import theme from '../theme';

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (result, args, cache, info) => {
            cache.updateQuery({ query: MeDocument }, (data) => {
              console.log('login result', result);
              console.log('updateQuery data', data);

              if (result.login.errors) {
                return data;
              } else {
                return {
                  me: result.login.user,
                };
              }
            });
          },

          register: (result, args, cache, info) => {
            cache.updateQuery({ query: MeDocument }, (data) => {
              if (result.register.errors) {
                return data;
              } else {
                return {
                  me: result.register.user,
                };
              }
            });
          },

          logout: (result, args, cache, info) => {
            cache.updateQuery({ query: MeDocument }, (data) => {
              if (result.logout.errors) {
                return data;
              } else {
                return { me: null };
              }
            });
          },
        },
      },
    }),
    fetchExchange,
  ],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
