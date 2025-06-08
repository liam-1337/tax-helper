// src/services/aiService.ts
import { FormData } from '../types/formData';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    "VITE_GEMINI_API_KEY is not set. Please ensure it's in your .env file."
  );
}

const genAI = new GoogleGenerativeAI(API_KEY || 'MISSING_API_KEY'); // Fallback to prevent crash if key is missing at init
const model = genAI.getGenerativeModel({ model: 'gemini-pro' }); // Or "gemini-1.0-pro"

export const generateTaxSummary = async (
  formData: FormData
): Promise<string> => {
  if (!API_KEY) {
    const errorMsg =
      "Error: Gemini API Key is missing. Please configure it in the application's environment variables.";
    console.error(errorMsg);
    return errorMsg;
  }

  // 1. Construct the prompt (same as before)
  let prompt =
    'You are a helpful Swiss tax assistant for the canton of St. Gallen, Switzerland. ';
  prompt += 'Your response MUST be formatted as Markdown. '; // Explicitly request Markdown
  prompt +=
    "Based on the following information, provide a structured summary of the user's tax data, offer general tips and considerations, and suggest potential standard deductions or tax optimization strategies applicable in St. Gallen. ";
  prompt +=
    "Crucially, include a strong disclaimer at the end that the output is AI-generated, for informational purposes only, not financial/tax advice, and doesn't replace professional consultation or official tax software.\n\n";

  prompt += "**User's Personal Data:**\n";
  prompt += `\`\`\`json
${JSON.stringify(formData.personal, null, 2)}
\`\`\`

`;

  prompt += "**User's Income Data (yearly amounts):**\n";
  prompt += `\`\`\`json
${JSON.stringify(formData.income, null, 2)}
\`\`\`

`;

  prompt += "**User's Deductions Data (yearly amounts):**\n";
  prompt += `\`\`\`json
${JSON.stringify(formData.deductions, null, 2)}
\`\`\`

`;

  if (formData.documents && formData.documents.length > 0) {
    prompt += "**User's Uploaded Documents (extracted text snippets):**\n";
    formData.documents.forEach((doc) => {
      prompt += `Document: ${doc.fileName}\nExtracted Text (first 300 chars):\n\`\`\`
${(doc.extractedText || 'N/A').substring(0, 300)}
\`\`\`

`;
    });
  }
  prompt += '\nRemember to format your entire response as Markdown.';

  console.log(
    'Attempting to generate summary with Gemini. Prompt length:',
    prompt.length
  );
  // console.log("Prompt for AI:", prompt); // Can be very long, log length instead or sample

  try {
    const generationConfig = {
      // temperature: 0.7, // Optional: control randomness
      // topK: 1, // Optional
      // topP: 1, // Optional
      // maxOutputTokens: 2048, // Optional
    };

    // Safety settings to reduce chances of harmful content blocking
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    if (response.promptFeedback && response.promptFeedback.blockReason) {
      const blockReason = response.promptFeedback.blockReason;
      console.error(
        'Prompt was blocked by Gemini API. Reason:',
        blockReason,
        response.promptFeedback
      );
      return `Error: The request was blocked by the AI. Reason: ${blockReason}. Please revise your input or try again later.`;
    }

    const summaryText = response.text();
    console.log('Successfully received summary from Gemini.');
    return summaryText;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    let errorMessage =
      'An unknown error occurred while contacting the AI service.';
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('API key not valid')) {
        errorMessage =
          'Error: The provided Gemini API Key is not valid. Please check your .env configuration.';
      } else if (
        error.message.includes('fetch failed') ||
        error.message.includes('NetworkError')
      ) {
        errorMessage =
          'Error: Network issue connecting to the AI service. Please check your internet connection.';
      }
    }
    return `Failed to generate AI summary: ${errorMessage}`;
  }
};
