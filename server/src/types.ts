import { EntityManager } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Session } from 'express-session';

export type Context = {
  em: EntityManager;
  req: Request & { session?: Session };
  res: Response;
};
