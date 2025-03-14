// resolvers.ts
import prisma from "../prisma/client"; // Assicurati di configurare Prisma correttamente

export const resolvers = {
  Query: {
    posts: async () => {
      return await prisma.post.findMany(); // Recupera i dati dei post dal DB
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post: async (_: any, { id }: { id: string }) => {
      return await prisma.post.findUnique({
        where: { id: parseInt(id) },
      });
    },
  },
};

module.exports = resolvers;
