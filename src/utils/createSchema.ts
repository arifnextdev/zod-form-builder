import { FieldValues } from "react-hook-form";
import { z, ZodType } from "zod";
import { FieldConfig } from "../types";

export function createSchema<T extends FieldValues>(
  fields: FieldConfig<T>[]
): ZodType<T> {
  const shape = fields.reduce((acc, field) => {
    acc[field.name] = field.validation || z.any(); // Use default validation if none is provided
    return acc;
  }, {} as Record<keyof T, ZodType<any>>);

  // Cast the schema to ZodType<T> using `as unknown` to bypass TypeScript's strict type checks
  return z.object(shape) as unknown as ZodType<T>;
}
