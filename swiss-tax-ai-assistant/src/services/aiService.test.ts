import { describe, it, expect, vi } from 'vitest';
import { FormData, PersonalInformation, IncomeData, DeductionsData } from '../types/forms'; // Adjust path if your types are elsewhere or structure differs

// Mock the GoogleGenerativeAI module
vi.mock('@google/generative-ai', () => {
  const mockGenerateContent = vi.fn();
  const mockResponse = { text: vi.fn() };

  // Ensure the mock chain is set up correctly for each call if needed, or a general mock
  mockGenerateContent.mockResolvedValue({ response: mockResponse });
  mockResponse.text.mockReturnValue('Mocked AI summary');

  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      }),
    })),
  };
});

// Import functions to be tested *after* mocks are set up
import { formatDataForPrompt, generateTaxSummary } from './aiService';

const mockFormData: FormData = {
  personalInfo: { fullName: 'Test User', address: '123 Test St', ahvNumber: '756.1234.5678.90', dateOfBirth: '1990-01-01', maritalStatus: 'single', religion: 'none', profession: 'Tester', email: 'test@example.com', phone: '555-1234' },
  income: { netSalary: 50000, freelanceIncome: 10000, rentalIncome: '', interestIncome: 500, dividendIncome: '' },
  deductions: { workExpenses: 1000, healthInsurance: 3000, accidentInsurance: '', lifeInsurance: 200, pillar3a: '', donations: 100, medicalExpenses: '', debtInterest: '', educationCosts: '' },
  uploadedDocuments: [],
  extractedTexts: [{ fileName: 'doc1.pdf', text: 'Sample text from document.', progress: 1, status: 'completed' }],
  aiSummary: '',
  aiSummaryStatus: 'idle',
};

describe('aiService - formatDataForPrompt', () => {
  it('should correctly format provided data into a string', () => {
    const prompt = formatDataForPrompt(mockFormData);
    expect(prompt).toContain("Full Name: Test User");
    expect(prompt).toContain("Address: 123 Test St");
    expect(prompt).toContain("Net Salary: 50000");
    expect(prompt).toContain("Freelance Income: 10000");
    expect(prompt).toContain("Interest Income: 500");
    expect(prompt).toContain("Rental Income: 0"); // Empty strings for numbers become 0
    expect(prompt).toContain("Work-related Expenses: 1000");
    expect(prompt).toContain("Health Insurance Premiums: 3000");
    expect(prompt).toContain("Life Insurance Premiums: 200");
    expect(prompt).toContain("Donations: 100");
    expect(prompt).toContain("Pillar 3a Contributions: 0"); // Empty strings for numbers become 0
    expect(prompt).toContain("Extracted Text from Documents");
    expect(prompt).toContain("Document 1 (doc1.pdf):\nSample text from document.");
  });

  it('should handle empty or N/A fields gracefully', () => {
    const emptyPersonalInfo: PersonalInformation = { fullName: '', address: '', ahvNumber: '', dateOfBirth: '', maritalStatus: '', religion: '', profession: '', email: '', phone: '' };
    const emptyIncome: IncomeData = { netSalary: '', freelanceIncome: '', rentalIncome: '', interestIncome: '', dividendIncome: '' };
    const emptyDeductions: DeductionsData = { workExpenses: '', healthInsurance: '', accidentInsurance: '', lifeInsurance: '', pillar3a: '', donations: '', medicalExpenses: '', debtInterest: '', educationCosts: '' };
    const formData: FormData = {
        personalInfo: emptyPersonalInfo, income: emptyIncome, deductions: emptyDeductions,
        uploadedDocuments: [], extractedTexts: [], aiSummary: '', aiSummaryStatus: 'idle'
    };
    const prompt = formatDataForPrompt(formData);
    expect(prompt).toContain("Full Name: N/A");
    expect(prompt).toContain("Net Salary: 0");
    expect(prompt).toContain("Work-related Expenses: 0");
    expect(prompt).not.toContain("Extracted Text from Documents"); // Section should be absent if no texts
  });
});

describe('aiService - generateTaxSummary', () => {
  // Set API Key for test environment if aiService relies on it directly at module scope
  // Vite handles this by default if VITE_GEMINI_API_KEY is in .env
  // If not, you might need: vi.stubEnv('VITE_GEMINI_API_KEY', 'test_api_key')

  it('should call the mocked generateContent and return its summary', async () => {
    // Access the mock through the imported module to ensure it's the same instance
    const { GoogleGenerativeAI } = await import('@google/generative-ai'); // Re-import to get mocked version if needed by test structure
    const genAIMockInstance = new (GoogleGenerativeAI as any)(); // Cast to any if TS complains about mock
    const modelMock = genAIMockInstance.getGenerativeModel();

    const summary = await generateTaxSummary(mockFormData);

    expect(modelMock.generateContent).toHaveBeenCalledTimes(1);
    // Check if the prompt passed to generateContent is as expected (optional, can be a snapshot)
    const calledPrompt = (modelMock.generateContent as any).mock.calls[0][0];
    expect(calledPrompt).toContain("Full Name: Test User"); // Verify some key data is in the prompt
    expect(calledPrompt).toContain("You are a helpful AI assistant specializing in Swiss taxes");

    expect(summary).toBe('Mocked AI summary');

    // Clean up mocks after test if they are not auto-cleaned by Vitest config
    vi.clearAllMocks(); // Or specific mock clear: (modelMock.generateContent as any).mockClear();
  });

  it('should return an error message if API_KEY is not configured (simulated by unsetting env)', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', ''); // Simulate missing API key
    // Need to re-import or re-evaluate aiService for the new env var to take effect if it's read at module load.
    // This can be tricky. A better way is to have aiService check API_KEY within the function.
    // The current aiService.ts checks API_KEY within generateTaxSummary, which is good.

    const summary = await generateTaxSummary(mockFormData); // formData doesn't matter here
    expect(summary).toContain("Error: Gemini API Key not configured");

    vi.unstubAllEnvs(); // Clean up env stub
  });
});
