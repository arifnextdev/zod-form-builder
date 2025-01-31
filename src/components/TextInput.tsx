import * as React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
const TextInput: React.FC<TextInputProps> = ({ label, error, ...props }) => {
  return (
    <div className="">
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        {...props}
        className={`${props.className}  ${
          error ? "border-red-500 focus:ring-red-500" : ""
        }`}
      />
      {error && (
        <p className="text-sm mt-1 text-red-500 animate-pulse">{error}</p>
      )}
    </div>
  );
};

export default React.memo(TextInput);
