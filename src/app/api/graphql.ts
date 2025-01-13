// /pages/api/graphql.js
import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "@/app/graphql/typeDefs";
import { resolvers } from "@/app/graphql/resolvers"; // Carica i resolver

// Inizializzazione di Apollo Server con il tipo e i resolver
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Crea il gestore per l'API route
const handler = server.createHandler({
  path: "/api/graphql", // La rotta API per il GraphQL
});

// Esportiamo il gestore come default per la rotta API
export default handler;

// Configurazione per evitare che Next.js elabori il body in modo predefinito (necessario per Apollo Server)
export const config = {
  api: {
    bodyParser: false, // Disabilita il body parser di Next.js
  },
};
