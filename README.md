# zod-form-builder

A dynamic form builder powered by **React Hook Form** and **Zod** for schema validation.

## 📦 Installation

```sh
npm install zod-form-builder
```

or

```sh
yarn add zod-form-builder
```

## 🚀 Usage Example

### **1. Import and Define Your Form Fields**

```tsx
"use client";
import { DynamicForms } from "zod-form-builder";
import { z } from "zod";
import { FieldConfig } from "zod-form-builder/dist/types";

// Define form values type
type LoginFormValues = {
  email: string;
  password: string;
  role: "admin" | "user";
  adminCode?: string;
};

// Define form fields
const loginFields: FieldConfig<LoginFormValues>[] = [
  {
    type: "email",
    name: "email",
    label: "Email",
    validation: z.string().email("Invalid email address"),
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    validation: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  },
  {
    type: "select",
    name: "role",
    label: "Role",
    validation: z.enum(["admin", "user"]),
    options: [
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
    ],
  },
  {
    type: "text",
    name: "adminCode",
    label: "Admin Code",
    validation: z.string().optional(),
    condition: (data) => data.role === "admin", // Only show if role is "admin"
  },
];

// Handle form submission
const onSubmit = async (data: LoginFormValues) => {
  console.log("Form submitted:", data);
};

const LoginForm = () => {
  return (
    <DynamicForms<LoginFormValues>
      defaultValues={{ email: "", password: "", role: "user", adminCode: "" }}
      onSubmit={onSubmit}
      fields={loginFields}
      inputStyle="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 "
      buttonStyle="bg-blue-500 py-2 px-5 rounded-xl "
      className="max-w-2xl mx-auto border p-5 mt-5 rounded-xl space-y-2 space-x-2"
    />
  );
};

export default LoginForm;
```

## 📚 API Reference

### `<DynamicForms />` Props

| Prop            | Type                | Description                         |
| --------------- | ------------------- | ----------------------------------- |
| `defaultValues` | `DefaultValues<T>`  | Initial form values                 |
| `onSubmit`      | `SubmitHandler<T>`  | Function called on form submission  |
| `fields`        | `FieldConfig<T>[]`  | Array of field configurations       |
| `className`     | `string` (optional) | Additional CSS classes for the form |
| `inputStyle`    | `string` (optional) | Custom styles for input fields      |
| `buttonStyle`   | `string` (optional) | Custom styles for the submit button |

### **FieldConfig Properties**

| Property     | Type                                            | Description                               |            |          |         |              |            |
| ------------ | ----------------------------------------------- | ----------------------------------------- | ---------- | -------- | ------- | ------------ | ---------- |
| `type`       | \`"text"                                        | "email"                                   | "password" | "select" | "radio" | "checkbox"\` | Field type |
| `name`       | `string`                                        | Unique field name                         |            |          |         |              |            |
| `label`      | `string`                                        | Field label                               |            |          |         |              |            |
| `validation` | `ZodType<any>`                                  | Zod validation schema                     |            |          |         |              |            |
| `options`    | `{ value: string; label: string }[]` (optional) | Options for select, radio fields          |            |          |         |              |            |
| `condition`  | `(data: T) => boolean` (optional)               | Function to conditionally show/hide field |            |          |         |              |            |

## 🔥 Features

- **Auto-validation** using `Zod`
- **Dynamic field rendering** with conditional logic
- **Minimal configuration** with `React Hook Form`
- **Custom styles** for inputs and buttons

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 📜 License

MIT License.
