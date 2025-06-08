import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  FormData,
  PersonalData,
  IncomeData,
  DeductionsData,
  FormStep,
} from '../types/formData';

interface FormContextType {
  currentStep: FormStep;
  formData: FormData;
  setCurrentStep: (step: FormStep) => void;
  updateFormData: (data: Partial<FormData>) => void;
  // updatePersonalData, updateIncomeData, etc. can be added for more granular updates
}

const initialFormData: FormData = {
  personal: {
    fullName: '',
    address: '',
    ahvNumber: '',
    dateOfBirth: '',
    maritalStatus: '',
    religion: '',
    profession: '',
    phone: '',
    email: '',
  },
  income: {
    netSalary: '',
    freelanceIncome: '',
    rentalIncome: '',
    capitalGains: '',
  },
  deductions: {
    workExpenses: '',
    healthInsurance: '',
    accidentInsurance: '',
    lifeInsurance: '',
    pillar3a: '',
    donations: '',
    medicalExpenses: '',
    debtInterest: '',
    furtherEducation: '',
  },
  documents: [], // Initialize documents array
  aiSummary: '', // Initialize aiSummary
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <FormContext.Provider
      value={{ currentStep, formData, setCurrentStep, updateFormData }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
