import { GoogleGenerativeAI } from "@google/generative-ai";
import { FormData } from '../types/forms'; // Adjust path as necessary

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not set. AI features will not work.");
  // Potentially throw an error or have a fallback mechanism
}

const genAI = new GoogleGenerativeAI(API_KEY || "fallback_key_if_not_set_for_type_checking"); // Fallback for type checking if API_KEY is undefined

// Helper function to format data for the prompt
const formatDataForPrompt = (formData: FormData): string => {
  let promptData = "User's Tax Information:\n";

  promptData += "\n--- Personal Information ---\n";
  promptData += `Full Name: ${formData.personalInfo.fullName || 'N/A'}\n`;
  promptData += `Address: ${formData.personalInfo.address || 'N/A'}\n`;
  promptData += `AHV Number: ${formData.personalInfo.ahvNumber || 'N/A'}\n`;
  promptData += `Date of Birth: ${formData.personalInfo.dateOfBirth || 'N/A'}\n`;
  promptData += `Marital Status: ${formData.personalInfo.maritalStatus || 'N/A'}\n`;
  promptData += `Religion: ${formData.personalInfo.religion || 'N/A'}\n`;
  promptData += `Profession: ${formData.personalInfo.profession || 'N/A'}\n`;
  promptData += `Email: ${formData.personalInfo.email || 'N/A'}\n`;
  promptData += `Phone: ${formData.personalInfo.phone || 'N/A'}\n`;

  promptData += "\n--- Income ---_\n";
  promptData += `Net Salary: ${formData.income.netSalary || 0}\n`;
  promptData += `Freelance Income: ${formData.income.freelanceIncome || 0}\n`;
  promptData += `Rental Income: ${formData.income.rentalIncome || 0}\n`;
  promptData += `Interest Income: ${formData.income.interestIncome || 0}\n`;
  promptData += `Dividend Income: ${formData.income.dividendIncome || 0}\n`;

  promptData += "\n--- Deductions ---_\n";
  promptData += `Work-related Expenses: ${formData.deductions.workExpenses || 0}\n`;
  promptData += `Health Insurance Premiums: ${formData.deductions.healthInsurance || 0}\n`;
  promptData += `Accident Insurance Premiums: ${formData.deductions.accidentInsurance || 0}\n`;
  promptData += `Life Insurance Premiums: ${formData.deductions.lifeInsurance || 0}\n`;
  promptData += `Pillar 3a Contributions: ${formData.deductions.pillar3a || 0}\n`;
  promptData += `Donations: ${formData.deductions.donations || 0}\n`;
  promptData += `Medical Expenses: ${formData.deductions.medicalExpenses || 0}\n`;
  promptData += `Debt Interest: ${formData.deductions.debtInterest || 0}\n`;
  promptData += `Further Education Costs: ${formData.deductions.educationCosts || 0}\n`;

  if (formData.extractedTexts && formData.extractedTexts.length > 0) {
    promptData += "\n--- Extracted Text from Documents ---\n";
    formData.extractedTexts.forEach((doc, index) => {
      if (doc.status === 'completed') {
        promptData += `Document ${index + 1} (${doc.fileName}):\n${doc.text}\n---\n`;
      }
    });
  }
  return promptData;
};

export const generateTaxSummary = async (formData: FormData): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API Key not configured. Please contact support or check your setup.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const formattedData = formatDataForPrompt(formData);

    const prompt = \`
      You are a helpful AI assistant specializing in Swiss taxes for the canton of St. Gallen.
      Your goal is to provide a summary of the user's tax situation, offer general tips, and suggest potential deductions based ONLY on the information provided.
      Do NOT invent any numbers or facts not present in the input.
      If information is missing for a certain category, state that clearly.

      User Data:
      \${formattedData}

      Based on the data above, please provide the following:
      1.  A structured summary of the tax data provided by the user.
      2.  General tax tips and considerations relevant to the user's situation in St. Gallen.
      3.  Potential standard deductions or tax optimization strategies applicable in St. Gallen that might be relevant based on the provided data. Do not list deductions if no related data is provided (e.g., don't suggest childcare deductions if no children are mentioned).

      IMPORTANT DISCLAIMER:
      This output is AI-generated and for informational purposes ONLY. It is NOT financial or tax advice and does not replace professional consultation with a qualified tax advisor or the use of official tax software. All information should be verified with official sources for the canton of St. Gallen.
    \`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;

  } catch (error) {
    console.error("Error generating tax summary:", error);
    let errorMessage = "An unexpected error occurred while generating the tax summary.";
    if (error instanceof Error) {
        errorMessage = \`Error generating tax summary: \${error.message}\`;
    }
    // Check for specific GoogleGenerativeAI error types if available from SDK, and customize message
    // For example, if (error.message.includes("API key not valid")) { ... }
    return errorMessage;
  }
};
