// typeDefs.ts
import { gql } from 'graphql-tag';


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


