import 'dotenv/config';

import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { __prod__ } from './contants';
import { Post } from './entities/Post';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  dbName: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  type: 'postgresql',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
