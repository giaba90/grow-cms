// graphql.ts
import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "@/app/graphql/typeDefs";
import { resolvers } from "@/app/graphql/resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = server.createHandler({
  path: "/api/graphql",
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
