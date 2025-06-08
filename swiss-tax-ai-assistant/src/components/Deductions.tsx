import React from 'react';
import { useFormContext } from '../contexts/FormContext';

const Deductions: React.FC = () => {
  const { formData, updateDeductionsData } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow empty string for clearing input, otherwise store as is (string).
    // Number conversion for calculations will be handled elsewhere.
    updateDeductionsData({ [name]: value });
  };

  const commonInputClassName = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center">Deductions Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label htmlFor="workExpenses" className={labelClassName}>Work Related Expenses (CHF)</label>
          <input type="number" name="workExpenses" id="workExpenses" value={formData.deductions.workExpenses} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 2000"/>
        </div>
        <div className="mb-4">
          <label htmlFor="healthInsurance" className={labelClassName}>Health Insurance Premiums (CHF)</label>
          <input type="number" name="healthInsurance" id="healthInsurance" value={formData.deductions.healthInsurance} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 3600"/>
        </div>
        <div className="mb-4">
          <label htmlFor="accidentInsurance" className={labelClassName}>Accident Insurance Premiums (CHF)</label>
          <input type="number" name="accidentInsurance" id="accidentInsurance" value={formData.deductions.accidentInsurance} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 1200"/>
        </div>
        <div className="mb-4">
          <label htmlFor="lifeInsurance" className={labelClassName}>Life Insurance Premiums (CHF)</label>
          <input type="number" name="lifeInsurance" id="lifeInsurance" value={formData.deductions.lifeInsurance} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 500"/>
        </div>
        <div className="mb-4">
          <label htmlFor="pillar3a" className={labelClassName}>Pillar 3a Contributions (CHF)</label>
          <input type="number" name="pillar3a" id="pillar3a" value={formData.deductions.pillar3a} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 6883"/>
        </div>
        <div className="mb-4">
          <label htmlFor="donations" className={labelClassName}>Donations (CHF)</label>
          <input type="number" name="donations" id="donations" value={formData.deductions.donations} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 300"/>
        </div>
        <div className="mb-4">
          <label htmlFor="medicalExpenses" className={labelClassName}>Medical Expenses (CHF)</label>
          <input type="number" name="medicalExpenses" id="medicalExpenses" value={formData.deductions.medicalExpenses} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 1000"/>
        </div>
        <div className="mb-4">
          <label htmlFor="debtInterest" className={labelClassName}>Debt Interest (e.g., loans, CHF)</label>
          <input type="number" name="debtInterest" id="debtInterest" value={formData.deductions.debtInterest} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 700"/>
        </div>
        <div className="mb-4">
          <label htmlFor="educationCosts" className={labelClassName}>Further Education Costs (CHF)</label>
          <input type="number" name="educationCosts" id="educationCosts" value={formData.deductions.educationCosts} onChange={handleChange} className={commonInputClassName} placeholder="e.g., 1500"/>
        </div>
      </div>
    </div>
  );
};

export default Deductions;
