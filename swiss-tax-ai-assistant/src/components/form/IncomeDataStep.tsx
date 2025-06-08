import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { IncomeData } from '../../types/formData';

const IncomeDataStep: React.FC = () => {
  const { formData, updateFormData } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Basic validation: allow only numbers and one decimal point for currency fields
    const sanitizedValue = value.match(/^\d*\.?\d*$/)
      ? value
      : formData.income[name as keyof IncomeData];

    const updatedIncomeData: IncomeData = {
      ...formData.income,
      [name]: sanitizedValue,
    };
    updateFormData({ income: updatedIncomeData });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">Income Information</h3>

      <div>
        <label
          htmlFor="netSalary"
          className="block text-sm font-medium text-gray-700"
        >
          Net Salary (yearly)
        </label>
        <input
          type="text" // Using text to allow for custom sanitization
          name="netSalary"
          id="netSalary"
          value={formData.income.netSalary}
          onChange={handleChange}
          placeholder="e.g., 70000"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="freelanceIncome"
          className="block text-sm font-medium text-gray-700"
        >
          Other Income (e.g., freelance, rental - yearly)
        </label>
        <input
          type="text"
          name="freelanceIncome"
          id="freelanceIncome"
          value={formData.income.freelanceIncome}
          onChange={handleChange}
          placeholder="e.g., 5000"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="rentalIncome"
          className="block text-sm font-medium text-gray-700"
        >
          Rental Income (yearly)
        </label>
        <input
          type="text"
          name="rentalIncome"
          id="rentalIncome"
          value={formData.income.rentalIncome}
          onChange={handleChange}
          placeholder="e.g., 12000"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="capitalGains"
          className="block text-sm font-medium text-gray-700"
        >
          Capital Gains (e.g., interest, dividends - yearly)
        </label>
        <input
          type="text"
          name="capitalGains"
          id="capitalGains"
          value={formData.income.capitalGains}
          onChange={handleChange}
          placeholder="e.g., 1500"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      {/* Add more income fields as needed */}
    </div>
  );
};

export default IncomeDataStep;
