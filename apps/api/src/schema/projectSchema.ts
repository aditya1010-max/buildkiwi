export const projectSchema = {
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "tags",
      label: "Technologies",
      type: "tags",
      placeholder: "React, Node.js, MongoDB",
    },
  ],
};
