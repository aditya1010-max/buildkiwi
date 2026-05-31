export const commentSchema = {
  // we dont need this initially , but added just make sure we have it when we need to validate comment creation
  fields: [
    {
      name: "content",
      type: "text",
      required: true,
    },
  ],
};
