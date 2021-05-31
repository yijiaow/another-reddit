import { EntityManager } from '@mikro-orm/core';

export type Context = {
  em: EntityManager;
};
