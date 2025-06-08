import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { PersonalData } from '../../types/formData';

const PersonalDataStep: React.FC = () => {
  const { formData, updateFormData } = useFormContext();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedPersonalData: PersonalData = {
      ...formData.personal,
      [name]: value,
    };
    updateFormData({ personal: updatedPersonalData });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">
        Personal Information
      </h3>

      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          id="fullName"
          value={formData.personal.fullName}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          type="text"
          name="address"
          id="address"
          value={formData.personal.address}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="ahvNumber"
          className="block text-sm font-medium text-gray-700"
        >
          AHV Number
        </label>
        <input
          type="text"
          name="ahvNumber"
          id="ahvNumber"
          value={formData.personal.ahvNumber}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="dateOfBirth"
          className="block text-sm font-medium text-gray-700"
        >
          Date of Birth
        </label>
        <input
          type="date"
          name="dateOfBirth"
          id="dateOfBirth"
          value={formData.personal.dateOfBirth}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="maritalStatus"
          className="block text-sm font-medium text-gray-700"
        >
          Marital Status
        </label>
        <select
          name="maritalStatus"
          id="maritalStatus"
          value={formData.personal.maritalStatus}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select...</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="religion"
          className="block text-sm font-medium text-gray-700"
        >
          Religion
        </label>
        <input
          type="text"
          name="religion"
          id="religion"
          value={formData.personal.religion}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="e.g., Roman Catholic, Protestant, None"
        />
      </div>

      <div>
        <label
          htmlFor="profession"
          className="block text-sm font-medium text-gray-700"
        >
          Profession
        </label>
        <input
          type="text"
          name="profession"
          id="profession"
          value={formData.personal.profession}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.personal.phone}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.personal.email}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default PersonalDataStep;
