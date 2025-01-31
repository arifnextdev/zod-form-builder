import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";

import { useMemo, useState } from "react";
import Button from "./components/Button";
import TextInput from "./components/TextInput";
import SelectInput from "./components/selectInputs";
import { DynamicFormProps } from "./types";
import { createSchema } from "./utils/createSchema";

export function DynamicForms<T extends FieldValues>({
  defaultValues,
  onSubmit,
  fields,
  inputStyle = "w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2",
  buttonStyle = "w-full px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
  className = "max-w-2xl mx-auto border p-5 grid grid-cols-2 gap-5 border-gray-300 focus:ring-blue-500",
}: DynamicFormProps<T>) {
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the schema creation to avoid unnecessary recalculations
  const schema = useMemo(() => createSchema(fields), [fields]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<T>({ resolver: zodResolver(schema), defaultValues });

  const handleFormSubmit = async (data: T) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formValues = watch();

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      {fields.map((field) => {
        const isVisible = field.conditional
          ? field.conditional(formValues)
          : true;
        if (!isVisible) return null;

        return (
          <div key={field.name}>
            {field.type === "text" ||
            field.type === "email" ||
            field.type === "password" ? (
              <TextInput
                label={field.label}
                id={field.name}
                className={inputStyle}
                {...register(field.name)}
                error={errors[field.name]?.message as string}
              />
            ) : field.type === "select" && field.options ? (
              <SelectInput
                id={field.name}
                label={field.label}
                className={field.className}
                options={field.options}
                {...register(field.name)}
                error={errors[field.name]?.message as string}
              />
            ) : null}
          </div>
        );
      })}
      <div className=" pt-2">
        <Button type="submit" disabled={isLoading} className={buttonStyle}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
