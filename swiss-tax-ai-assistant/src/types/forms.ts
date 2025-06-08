export interface PersonalInformation {
  fullName: string;
  address: string;
  ahvNumber: string;
  dateOfBirth: string;
  maritalStatus: string;
  religion: string;
  profession: string;
  email: string;
  phone: string;
}

export interface IncomeData {
  netSalary: number | string; // Allow string for empty input, parse to number
  freelanceIncome: number | string;
  rentalIncome: number | string;
  interestIncome: number | string;
  dividendIncome: number | string;
}

export interface DeductionsData {
  workExpenses: number | string;
  healthInsurance: number | string;
  accidentInsurance: number | string;
  lifeInsurance: number | string;
  pillar3a: number | string;
  donations: number | string;
  medicalExpenses: number | string;
  debtInterest: number | string;
  educationCosts: number | string;
}

export interface FormData {
  personalInfo: PersonalInformation;
  income: IncomeData;
  deductions: DeductionsData;
  uploadedDocuments: File[];
  extractedTexts: ExtractedTextData[];
  aiSummary: string;
  aiSummaryStatus: 'idle' | 'loading' | 'completed' | 'error';
}

export interface ExtractedTextData {
  fileName: string;
  text: string;
  progress: number; // 0 to 1 for Tesseract.js progress
  status: string; // e.g., 'idle', 'processing', 'completed', 'error'
}
