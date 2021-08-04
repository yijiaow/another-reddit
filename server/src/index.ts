import 'reflect-metadata';
import { createConnection } from 'typeorm';
import path from 'path';
import express from 'express';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { __prod__ } from './contants';
import { Post } from './entities/Post';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

declare module 'express-session' {
  export interface SessionData {
    uid: number;
  }
}

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [Post],
  });

  const app = express();

  const redisClient = redis.createClient();
  const RedisStore = connectRedis(session);

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }),
      secret: process.env.SESSION_SECRET!,
      cookie: {
        httpOnly: true,
        secure: __prod__,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 14,
      },
      saveUninitialized: false,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res, redis: redisClient }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: { origin: 'http://localhost:3000', credentials: true },
  });

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });
};

main().catch((err) => console.error(err));
