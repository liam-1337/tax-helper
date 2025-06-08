export interface PersonalData {
  fullName: string;
  address: string;
  ahvNumber: string;
  dateOfBirth: string;
  maritalStatus: string;
  religion: string;
  profession: string;
  phone: string;
  email: string;
}

export interface IncomeData {
  netSalary: string; // Using string for now, can be number with validation
  freelanceIncome: string;
  rentalIncome: string;
  capitalGains: string;
}

export interface DeductionsData {
  workExpenses: string;
  healthInsurance: string;
  accidentInsurance: string;
  lifeInsurance: string;
  pillar3a: string;
  donations: string;
  medicalExpenses: string;
  debtInterest: string;
  furtherEducation: string;
}

export interface UploadedDocument {
  id: string; // Unique ID for the document, e.g., timestamp + name
  file: File; // The actual file object
  fileName: string;
  fileType: string;
  extractedText?: string; // To be populated by OCR
}

export interface FormData {
  personal: PersonalData;
  income: IncomeData;
  deductions: DeductionsData;
  documents: UploadedDocument[]; // Array to store uploaded document info
  aiSummary?: string; // To store the AI-generated summary
}

export type FormStep =
  | 'personal'
  | 'income'
  | 'deductions'
  | 'documents'
  | 'review'
  | 'summary';
