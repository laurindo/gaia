import { ApolloClient, InMemoryCache, split, HttpLink, ApolloLink, concat } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const cache = new InMemoryCache();

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      'x-hasura-admin-secret': process.env.NEXT_PUBLIC_API_SECRET
    }
  });

  return forward(operation);
});

const wsLink = process.browser
  ? new WebSocketLink({
      uri: process.env.NEXT_PUBLIC_API_WS_URL,
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
            'x-hasura-admin-secret': process.env.NEXT_PUBLIC_API_SECRET
          }
        }
      }
    })
  : null;

const link = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      concat(authMiddleware, httpLink)
    )
  : httpLink;

const client = new ApolloClient({
  link,
  cache
});

export default client;
