import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './contants';
import { Post } from './entities/Post';

const main = async () => {
  const orm = await MikroORM.init({
    entities: [Post],
    dbName: 'another-reddit',
    type: 'postgresql',
    debug: !__prod__,
  });
};

main();
