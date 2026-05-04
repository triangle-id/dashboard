type Props = {
  label: string;
  name?: string;
  type?: string;
  defaultValue?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  minLength?: number;
  hint?: string;
};

export function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  value,
  required,
  disabled,
  placeholder,
  minLength,
  hint,
}: Props) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        value={value}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        minLength={minLength}
        readOnly={value !== undefined}
        className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100 disabled:text-gray-500"
      />
      {hint ? <span className="mt-1 block text-xs text-gray-500">{hint}</span> : null}
    </label>
  );
}
