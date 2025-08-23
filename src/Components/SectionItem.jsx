/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/SectionItem.jsx
import React from 'react';
import InputField from '../Components/InputField';

const SectionItem = ({
  item,
  index,
  fields,
  updateAction,
  removeAction,
  addDescAction,
  updateDescAction,
  removeDescAction,
  checkboxField,
  onSave,
  onDelete,
  onGetDescription,
  isSaving,
  isDeleting,
  isSuggestingDesc,
  sectionName,
  dispatch,
}) => {
  const handleChange = (field, value) => {
    dispatch(updateAction({ index, data: { [field]: value } }));
  };

  const handleCheckbox = (field, checked) => {
    dispatch(updateAction({ index, data: { [field]: checked } }));
  };

  const handleAddDesc = () => dispatch(addDescAction({ index }));
  const handleUpdateDesc = (descIndex, value) => dispatch(updateDescAction({ [`${sectionName}Index`]: index, descIndex, value }));
  const handleRemoveDesc = (descIndex) => dispatch(removeDescAction({ [`${sectionName}Index`]: index, descIndex }));

  return (
    <div className="border p-4 mb-4 rounded-md bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <InputField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type || 'text'}
            value={item[field.name]}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        ))}
      </div>
      {checkboxField && (
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            name={checkboxField.name}
            checked={item[checkboxField.name]}
            onChange={(e) => handleCheckbox(checkboxField.name, e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">{checkboxField.label}</span>
        </label>
      )}
      {item.description && (
        <>
          <h4 className="text-md font-medium mt-4 mb-2">Description</h4>
          {item.description.map((desc, dIndex) => (
            <div key={dIndex} className="flex items-center mb-2">
              <InputField
                value={desc}
                onChange={(e) => handleUpdateDesc(dIndex, e.target.value)}
                className="flex-1"
              />
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700 text-sm"
                onClick={() => handleRemoveDesc(dIndex)}
                aria-label={`Remove description ${dIndex + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
            onClick={handleAddDesc}
            aria-label={`Add description to ${sectionName}`}
          >
            Add Description
          </button>
          {onGetDescription && (
            <button
              type="button"
              className="mt-2 ml-4 bg-indigo-600 text-white py-1 px-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 text-sm"
              onClick={() => onGetDescription(index)}
              disabled={isSuggestingDesc}
              aria-label={`Get AI description for ${sectionName}`}
            >
              {isSuggestingDesc ? 'Generating...' : 'Get AI Description'}
            </button>
          )}
        </>
      )}
      {onSave && onDelete && (
        <div className="mt-4 flex gap-4">
          <button
            type="button"
            className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 disabled:bg-green-400 text-sm"
            onClick={() => onSave(index)}
            disabled={isSaving}
            aria-label={`Save ${sectionName}`}
          >
            Save
          </button>
          <button
            type="button"
            className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 disabled:bg-red-400 text-sm"
            onClick={() => onDelete(index)}
            disabled={isDeleting}
            aria-label={`Delete ${sectionName}`}
          >
            Delete
          </button>
        </div>
      )}
      {!onSave && (
        <button
          type="button"
          className="mt-4 text-red-500 hover:text-red-700 text-sm"
          onClick={() => dispatch(removeAction(index))}
          aria-label={`Remove ${sectionName}`}
        >
          Remove {sectionName}
        </button>
      )}
    </div>
  );
};

export default SectionItem;