import superjson from "superjson";
// Utility function to serialize post
export const serializePost = (post: PostData) => {
  const { json } = superjson.serialize(post);
  return json;
};
