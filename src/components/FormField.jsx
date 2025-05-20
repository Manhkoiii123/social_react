import { Controller } from "react-hook-form";

const FormField = ({ control, label, name, type, Component }) => {
  return (
    <div>
      <p className="text-dark-100 mb-1 text-sm font-bold">{label}</p>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, name } }) => {
          return (
            <Component
              onChange={onChange}
              value={value}
              name={name}
              type={type}
              control={control}
            />
          );
        }}
      />
    </div>
  );
};
export default FormField;
