import {buildSchemaSync} from 'type-graphql';
import {ImageResolver} from './image';
import {HackafestResolver} from './hackafest';
import {authChecker} from './auth';

export const schema = buildSchemaSync({
  resolvers: [ImageResolver, HackafestResolver],
  emitSchemaFile: process.env.NODE_ENV === 'development',
  authChecker,
});
