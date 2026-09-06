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
      name: "coverSeed",
      label: "Cover",
      type: "cover",
    },
    {
      name: "github",
      label: "GitHub Repository",
      type: "text",
      placeholder: "https://github.com/username/repository",
    },
    {
      name: "demo",
      label: "Live Demo",
      type: "text",
      placeholder: "https://example.com",
    },
  ],
};

export default projectSchema;
