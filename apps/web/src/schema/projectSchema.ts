import type { FormSchema } from "../types/schema";

const projectSchema: FormSchema = {
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description",
    },
    {
      name: "tags",
      label: "Technologies",
      type: "tags",
      placeholder: "React, Node.js, MongoDB",
    },
    {
      name: "coverImage",
      label: "Project Cover Image",
      type: "image",
    },
    {
      type: "text",
      name: "github",
      label: "GitHub Repository",
      placeholder: "https://github.com/username/repository",
    },
    {
      type: "text",
      name: "demo",
      label: "Live Demo",
      placeholder: "https://example.com",
    },
  ],
};

export default projectSchema;
