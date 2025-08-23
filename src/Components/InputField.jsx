/* eslint-disable react/prop-types */
// src/components/InputField.jsx

const InputField = ({ label, name, value, onChange, type = 'text', className = '', required = false }) => {
  const id = `input-${name}`;
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          rows="4"
          required={required}
          aria-required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required={required}
          aria-required={required}
        />
      )}
    </div>
  );
};

export default InputField;