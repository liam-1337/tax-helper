import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { DeductionsData } from '../../types/formData';

const DeductionsDataStep: React.FC = () => {
  const { formData, updateFormData } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Basic validation: allow only numbers and one decimal point for currency fields
    const sanitizedValue = value.match(/^\d*\.?\d*$/)
      ? value
      : formData.deductions[name as keyof DeductionsData];

    const updatedDeductionsData: DeductionsData = {
      ...formData.deductions,
      [name]: sanitizedValue,
    };
    updateFormData({ deductions: updatedDeductionsData });
  };

  // Helper for creating input fields
  const renderInputField = (
    name: keyof DeductionsData,
    label: string,
    placeholder?: string
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text" // Using text for custom sanitization
        name={name}
        id={name}
        value={formData.deductions[name]}
        onChange={handleChange}
        placeholder={placeholder || 'e.g., 1000'}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">
        Deductions Information (yearly amounts)
      </h3>

      {renderInputField(
        'workExpenses',
        'Work-related Expenses',
        'e.g., travel, meals, equipment'
      )}
      {renderInputField('healthInsurance', 'Health Insurance Premiums')}
      {renderInputField(
        'accidentInsurance',
        'Accident Insurance Premiums (Non-occupational)'
      )}
      {renderInputField('lifeInsurance', 'Life Insurance Premiums')}
      {renderInputField('pillar3a', 'Pillar 3a Contributions')}
      {renderInputField('donations', 'Donations to Charitable Organizations')}
      {renderInputField(
        'medicalExpenses',
        'Medical Expenses (not covered by insurance)'
      )}
      {renderInputField(
        'debtInterest',
        'Debt Interest (e.g., loans, mortgages)'
      )}
      {renderInputField('furtherEducation', 'Further Education Costs')}
    </div>
  );
};

export default DeductionsDataStep;
