import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, useForm, useWatch } from "react-hook-form";
import { useMemo, useState, memo, useCallback } from "react";
import Button from "./components/Button";
import TextInput from "./components/TextInput";
import { DynamicFormProps } from "./types";
import { createSchema } from "./utils/createSchema";
import selectInputs from "./components/selectInputs";

const MemoizedTextInput = memo(TextInput);
const MemoizedSelectInput = memo(selectInputs);

export function DynamicForms<T extends FieldValues>({
  defaultValues,
  onSubmit,
  fields,
  inputStyle = "w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2",
  buttonStyle = "w-full px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
  className = "max-w-2xl mx-auto border p-5 grid grid-cols-2 gap-5 border-gray-300 focus:ring-blue-500",
}: DynamicFormProps<T>) {
  const [isLoading, setIsLoading] = useState(false);

  // Memoize schema and fields
  const memoizedFields = useMemo(() => fields, [fields]);
  const schema = useMemo(() => createSchema(memoizedFields), [memoizedFields]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  // Watch all fields to isolate conditional rendering
  const watchedValues = useWatch({ control }) as T;

  // Memoized error object to prevent unnecessary renders
  const memoizedErrors = useMemo(() => errors, [errors]);

  // Memoized form submit function
  const handleFormSubmit = useCallback(
    async (data: T) => {
      setIsLoading(true);
      try {
        await onSubmit(data);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onSubmit]
  );

  // Memoized register function to avoid re-renders
  const memoizedRegister = useCallback(register, []);

  // Render fields efficiently
  const renderedFields = useMemo(
    () =>
      memoizedFields.map((field) => {
        const isVisible = field.conditional
          ? field.conditional(watchedValues)
          : true;
        if (!isVisible) return null;

        const registerField = memoizedRegister(field.name);

        return (
          <div key={field.name}>
            {field.type === "text" ||
            field.type === "email" ||
            field.type === "password" ? (
              <MemoizedTextInput
                label={field.label}
                id={field.name}
                className={inputStyle}
                {...registerField}
                error={memoizedErrors[field.name]?.message as string}
              />
            ) : field.type === "select" && field.options ? (
              <MemoizedSelectInput
                id={field.name}
                label={field.label}
                className={field.className || inputStyle}
                options={field.options}
                {...registerField}
                error={memoizedErrors[field.name]?.message as string}
              />
            ) : null}
          </div>
        );
      }),
    [
      memoizedFields,
      watchedValues,
      memoizedErrors,
      memoizedRegister,
      inputStyle,
    ]
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      {renderedFields}
      <div className="pt-2">
        <Button type="submit" disabled={isLoading} className={buttonStyle}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
