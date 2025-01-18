// typeDefs.ts
import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  type Post {
    id: ID!
    title: String!
    content: String!
  }
`;

module.exports = typeDefs;
