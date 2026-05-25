export type FieldType = "text" | "textarea";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
}

export interface FormSchema {
  fields: Field[];
}