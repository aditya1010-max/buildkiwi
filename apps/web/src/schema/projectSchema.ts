import type { FormSchema } from "../types/schema";

const projectSchema: FormSchema = {
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Give your project a name",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder:
        "Describe what you built, what it does, and what makes it interesting...",
    },
    {
      name: "tags",
      label: "Technologies",
      type: "tags",
      placeholder: "Add languages, frameworks, AI tools...",
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
      placeholder: "https://your-project.com",
    },
  ],
};

export default projectSchema;
