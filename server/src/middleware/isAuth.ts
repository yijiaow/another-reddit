import { AuthenticationError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql';
import { Context } from '../types';

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context.req.session.uid) {
    throw new AuthenticationError('Not authenticated');
  }

  next();
};
