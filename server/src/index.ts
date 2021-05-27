import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import mikroConfig from './mikro-orm.config';
import { Post } from './entities/Post';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  const post = orm.em.create(Post, { title: 'First Post' });
  await orm.em.persistAndFlush(post);
};

main().catch((err) => console.error(err));
