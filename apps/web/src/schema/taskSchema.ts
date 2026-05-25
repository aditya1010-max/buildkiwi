import type { FormSchema } from "../types/schema";

const taskSchema: FormSchema = {
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title"
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description"
    }
  ]
};

export default taskSchema;