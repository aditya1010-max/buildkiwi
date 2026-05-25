type Field = {
  name: string;
  type: string;
  required?: boolean;
};

type Schema = {
  fields: Field[];
};

export function validateSchemaData(
  schema: Schema,
  data: Record<string, any>
) {
  const errors: string[] = [];

  for (const field of schema.fields) {
    const value = data[field.name];

    if (field.required && !value) {
      errors.push(`${field.name} is required`);
      continue;
    }
    
    if (value) {
      switch (field.type) {
        case "text":
        case "textarea":
          if (typeof value !== "string") {
            errors.push(`${field.name} must be a string`);
          }
          break;

        case "number":
          if (typeof value !== "number") {
            errors.push(`${field.name} must be a number`);
          }
          break;
      }
    }
  }

  return errors;
}