import 'reflect-metadata';
import {NextApiRequest} from 'next';
import {ApolloServer} from 'apollo-server-micro';
import {schema} from 'graphql/schema';
import {Context} from 'graphql/schema/context';
import {prisma} from 'prisma/client';
import {loadIdToken} from 'lib/firebase/admin';

const server = new ApolloServer({
  schema,
  context: async ({req}: { req: NextApiRequest }): Promise<Context> => {
    const uid = await loadIdToken(req);

    return {
      uid,
      prisma,
    };
  },
  tracing: process.env.NODE_ENV === 'development',
});

const handler = server.createHandler({path: '/api/graphql'});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
