import React, { createContext, useState, useContext, ReactNode } from 'react';
import { FormData, PersonalInformation, IncomeData, DeductionsData, ExtractedTextData } from '../types/forms';

interface FormContextType {
  formData: FormData;
  updatePersonalInformation: (data: Partial<PersonalInformation>) => void;
  updateIncomeData: (data: Partial<IncomeData>) => void;
  updateDeductionsData: (data: Partial<DeductionsData>) => void;
  updateUploadedDocuments: (files: File[]) => void;
  updateExtractedTexts: (texts: ExtractedTextData[]) => void;
  setSpecificExtractedText: (index: number, data: Partial<ExtractedTextData>) => void;
  addExtractedTextEntry: (fileName: string) => void;
  updateAISummary: (summary: string, status: 'idle' | 'loading' | 'completed' | 'error') => void;
}

const initialFormData: FormData = {
  personalInfo: {
    fullName: '', address: '', ahvNumber: '', dateOfBirth: '',
    maritalStatus: '', religion: '', profession: '', email: '', phone: '',
  },
  income: {
    netSalary: '', freelanceIncome: '', rentalIncome: '',
    interestIncome: '', dividendIncome: '',
  },
  deductions: {
    workExpenses: '', healthInsurance: '', accidentInsurance: '', lifeInsurance: '',
    pillar3a: '', donations: '', medicalExpenses: '', debtInterest: '', educationCosts: '',
  },
  uploadedDocuments: [],
  extractedTexts: [],
  aiSummary: '',
  aiSummaryStatus: 'idle',
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updatePersonalInformation = (data: Partial<PersonalInformation>) => {
    setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, ...data } }));
  };

  const updateIncomeData = (data: Partial<IncomeData>) => {
    setFormData(prev => ({ ...prev, income: { ...prev.income, ...data } }));
  };

  const updateDeductionsData = (data: Partial<DeductionsData>) => {
    setFormData(prev => ({ ...prev, deductions: { ...prev.deductions, ...data } }));
  };

  const updateUploadedDocuments = (files: File[]) => {
    setFormData(prev => ({ ...prev, uploadedDocuments: files }));
  };

  const updateExtractedTexts = (texts: ExtractedTextData[]) => {
    setFormData(prev => ({ ...prev, extractedTexts: texts }));
  };

  const setSpecificExtractedText = (index: number, data: Partial<ExtractedTextData>) => {
    setFormData(prev => {
      const newExtractedTexts = [...prev.extractedTexts];
      if (newExtractedTexts[index]) {
        newExtractedTexts[index] = { ...newExtractedTexts[index], ...data };
      }
      return { ...prev, extractedTexts: newExtractedTexts };
    });
  };

  const addExtractedTextEntry = (fileName: string) => {
    setFormData(prev => ({
      ...prev,
      extractedTexts: [
        ...prev.extractedTexts,
        { fileName, text: '', progress: 0, status: 'idle' }
      ]
    }));
  };

  const updateAISummary = (summary: string, status: 'idle' | 'loading' | 'completed' | 'error') => {
    setFormData(prev => ({ ...prev, aiSummary: summary, aiSummaryStatus: status }));
  };

  return (
    <FormContext.Provider value={{
      formData,
      updatePersonalInformation,
      updateIncomeData,
      updateDeductionsData,
      updateUploadedDocuments,
      updateExtractedTexts,
      setSpecificExtractedText,
      addExtractedTextEntry,
      updateAISummary
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
