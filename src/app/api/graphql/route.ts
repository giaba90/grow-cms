import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';

import { typeDefs } from '@/app/graphql/typeDefs';
import { resolvers } from '@/app/graphql/resolvers';

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req, _ctx) => ({
        req,
    }),
});

export async function GET(req: NextRequest, ctx: any) {
    return handler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
    return handler(req, ctx);
}
