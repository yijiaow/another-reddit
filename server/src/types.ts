import { EntityManager } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Session } from 'express-session';
import { RedisClient } from 'redis';

export type Context = {
  em: EntityManager;
  redis: RedisClient;
  req: Request & { session?: Session };
  res: Response;
};
