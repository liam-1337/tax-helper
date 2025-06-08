import React from 'react';
import { useFormContext } from '../contexts/FormContext';

const PersonalData: React.FC = () => {
  const { formData, updatePersonalInformation } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updatePersonalInformation({ [e.target.name]: e.target.value });
  };

  const commonInputClassName = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label htmlFor="fullName" className={labelClassName}>Full Name *</label>
          <input type="text" name="fullName" id="fullName" value={formData.personalInfo.fullName} onChange={handleChange} className={commonInputClassName} required />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className={labelClassName}>Address *</label>
          <input type="text" name="address" id="address" value={formData.personalInfo.address} onChange={handleChange} className={commonInputClassName} required />
        </div>
        <div className="mb-4">
          <label htmlFor="ahvNumber" className={labelClassName}>AHV Number *</label>
          <input type="text" name="ahvNumber" id="ahvNumber" value={formData.personalInfo.ahvNumber} onChange={handleChange} className={commonInputClassName} required />
        </div>
        <div className="mb-4">
          <label htmlFor="dateOfBirth" className={labelClassName}>Date of Birth *</label>
          <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.personalInfo.dateOfBirth} onChange={handleChange} className={commonInputClassName} required />
        </div>
        <div className="mb-4">
          <label htmlFor="maritalStatus" className={labelClassName}>Marital Status *</label>
          <select name="maritalStatus" id="maritalStatus" value={formData.personalInfo.maritalStatus} onChange={handleChange} className={commonInputClassName} required>
            <option value="">Select...</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="religion" className={labelClassName}>Religion</label>
          <input type="text" name="religion" id="religion" value={formData.personalInfo.religion} onChange={handleChange} className={commonInputClassName} />
        </div>
        <div className="mb-4">
          <label htmlFor="profession" className={labelClassName}>Profession *</label>
          <input type="text" name="profession" id="profession" value={formData.personalInfo.profession} onChange={handleChange} className={commonInputClassName} required />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className={labelClassName}>Email Address *</label>
          <input type="email" name="email" id="email" value={formData.personalInfo.email} onChange={handleChange} className={commonInputClassName} required />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className={labelClassName}>Phone Number</label>
          <input type="tel" name="phone" id="phone" value={formData.personalInfo.phone} onChange={handleChange} className={commonInputClassName} />
        </div>
      </div>
    </div>
  );
};

export default PersonalData;
