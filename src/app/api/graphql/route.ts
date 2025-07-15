import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { typeDefs } from '@/app/graphql/typeDefs';
import { resolvers } from '@/app/graphql/resolvers';

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Qui accetta sia `req` sia `context`
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req, context) => ({
        req,
        context, // opzionale, puoi anche non usarlo
    }),
});

export { handler as GET, handler as POST };
