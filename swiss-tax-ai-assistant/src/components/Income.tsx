import React from 'react';
import { useFormContext } from '../contexts/FormContext';

const Income: React.FC = () => {
  const { formData, updateIncomeData } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow empty string for clearing input, otherwise store as is (string).
    // Number conversion for calculations will be handled elsewhere (e.g., on review/submit).
    updateIncomeData({ [name]: value });
  };

  const commonInputClassName = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center">Income Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label htmlFor="netSalary" className={labelClassName}>Net Salary (CHF)</label>
          <input type="number" name="netSalary" id="netSalary" value={formData.income.netSalary} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 70000" />
        </div>
        <div className="mb-4">
          <label htmlFor="freelanceIncome" className={labelClassName}>Freelance Income (CHF)</label>
          <input type="number" name="freelanceIncome" id="freelanceIncome" value={formData.income.freelanceIncome} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 15000" />
        </div>
        <div className="mb-4">
          <label htmlFor="rentalIncome" className={labelClassName}>Rental Income (CHF)</label>
          <input type="number" name="rentalIncome" id="rentalIncome" value={formData.income.rentalIncome} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 5000" />
        </div>
        <div className="mb-4">
          <label htmlFor="interestIncome" className={labelClassName}>Interest Income (CHF)</label>
          <input type="number" name="interestIncome" id="interestIncome" value={formData.income.interestIncome} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 500" />
        </div>
        <div className="mb-4">
          <label htmlFor="dividendIncome" className={labelClassName}>Dividend Income (CHF)</label>
          <input type="number" name="dividendIncome" id="dividendIncome" value={formData.income.dividendIncome} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 1200" />
        </div>
      </div>
    </div>
  );
};

export default Income;
