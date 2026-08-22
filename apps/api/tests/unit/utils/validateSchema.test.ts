import { describe, expect, it } from "@jest/globals";

import { validateSchemaData } from "../../../src/utils/validateSchema";

describe("validateSchemaData", () => {
  it("returns no errors for valid data", () => {
    const schema = {
      fields: [
        { name: "name", type: "text", required: true },
        { name: "age", type: "number" },
      ],
    };

    const data = {
      name: "Aditya",
      age: 22,
    };

    expect(validateSchemaData(schema, data)).toEqual([]);
  });

  it("reports missing required fields", () => {
    const schema = {
      fields: [{ name: "name", type: "text", required: true }],
    };

    const errors = validateSchemaData(schema, {});

    expect(errors).toEqual(["name is required"]);
  });

  it("rejects non-string values for text fields", () => {
    const schema = {
      fields: [{ name: "name", type: "text" }],
    };

    const errors = validateSchemaData(schema, {
      name: 123,
    });

    expect(errors).toEqual(["name must be a string"]);
  });

  it("rejects non-number values for number fields", () => {
    const schema = {
      fields: [{ name: "age", type: "number" }],
    };

    const errors = validateSchemaData(schema, {
      age: "22",
    });

    expect(errors).toEqual(["age must be a number"]);
  });

  it("ignores missing optional fields", () => {
    const schema = {
      fields: [{ name: "bio", type: "textarea" }],
    };

    const errors = validateSchemaData(schema, {});

    expect(errors).toEqual([]);
  });
});

/*
Test coverage:

1. Returns no errors for valid data
   → Verifies valid text and number values pass validation.

2. Reports missing required fields
   → Verifies required fields produce the expected validation error when
     no value is provided.

3. Rejects non-string values for text fields
   → Verifies text and textarea-style fields only accept string values.

4. Rejects non-number values for number fields
   → Verifies number fields only accept numeric values.

5. Ignores missing optional fields
   → Verifies fields that are not required can be omitted without
     producing a validation error.
*/
