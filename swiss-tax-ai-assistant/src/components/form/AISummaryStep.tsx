// src/components/form/AISummaryStep.tsx
import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { generateTaxSummary } from '../../services/aiService'; // Import the service

const AISummaryStep: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [errorAI, setErrorAI] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsLoadingAI(true);
    setErrorAI(null);
    try {
      const summary = await generateTaxSummary(formData);
      updateFormData({ aiSummary: summary });
    } catch (err) {
      console.error('Error generating AI summary:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      setErrorAI(errorMessage);
      updateFormData({
        aiSummary: `Failed to generate summary: ${errorMessage}`,
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-700">
        AI Tax Assistant Summary
      </h3>
      <button
        onClick={handleGenerateSummary}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoadingAI}
      >
        {isLoadingAI ? 'Generating...' : 'Generate AI Summary'}
      </button>

      {errorAI && (
        <div className="mt-4 p-3 border rounded bg-red-100 text-red-700">
          <h4 className="font-semibold mb-1">Error:</h4>
          <p className="text-sm">{errorAI}</p>
        </div>
      )}

      {formData.aiSummary &&
        !errorAI && ( // Only show if no error, error message is in aiSummary if needed
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h4 className="font-semibold mb-2">Summary:</h4>
            {/* Using a div with whitespace-pre-wrap for now. Markdown rendering can be added later. */}
            <div className="whitespace-pre-wrap text-sm">
              {formData.aiSummary}
            </div>
          </div>
        )}
      {!formData.aiSummary && !isLoadingAI && !errorAI && (
        <p className="text-sm text-gray-500 mt-4">
          Click the button above to generate your AI-powered tax summary and
          tips.
        </p>
      )}

      <p className="text-xs text-red-600 mt-4 p-2 border border-red-300 bg-red-50 rounded">
        <strong>Disclaimer:</strong> The output is AI-generated, for
        informational purposes only, not financial/tax advice, and doesn&apos;t
        replace professional consultation or official tax software.
      </p>
    </div>
  );
};

export default AISummaryStep;
