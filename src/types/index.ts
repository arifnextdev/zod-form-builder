import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
} from "react-hook-form";
import { ZodType } from "zod";

export interface FieldConfig<T extends FieldValues> {
  type: "text" | "email" | "password" | "select" | "radio" | "checkbox";
  name: Path<T>;
  label: string;
  validation: ZodType<any>;
  options?: { value: string; label: string }[];
  conditional?: (data: T) => boolean;
  className?: string;
}

export interface DynamicFormProps<T extends FieldValues> {
  defaultValues: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  fields: FieldConfig<T>[];
  className?: string;
  inputStyle?: string;
  buttonStyle?: string;
}
