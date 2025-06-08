import React from 'react';
import { useFormContext } from '../contexts/FormContext';
import { generateTaxSummary } from '../services/aiService';
import ReactMarkdown from 'react-markdown';

const AISummary: React.FC = () => {
  const { formData, updateAISummary } = useFormContext();
  const { aiSummary, aiSummaryStatus } = formData;

  const handleGenerateSummary = async () => {
    if (aiSummaryStatus === 'loading') return;
    updateAISummary('', 'loading');
    try {
      const summaryText = await generateTaxSummary(formData);
      updateAISummary(summaryText, 'completed');
    } catch (error) {
      console.error("AI Summary Generation Error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while generating the summary.";
      updateAISummary(`Error generating summary: ${errorMessage}`, 'error');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">AI Tax Summary & Assistance</h2>

      <div className="text-center mb-6">
        <button
          onClick={handleGenerateSummary}
          disabled={aiSummaryStatus === 'loading'}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md
                     disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          {aiSummaryStatus === 'loading' ? 'Generating Summary...' : 'Generate AI Tax Summary'}
        </button>
      </div>

      {aiSummaryStatus === 'loading' && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-blue-600">Loading AI summary, please wait...</p>
          <p className="text-sm text-gray-500">This may take a moment.</p>
        </div>
      )}
      {aiSummaryStatus === 'error' && (
        <div className="mt-4 p-4 border border-red-400 bg-red-50 text-red-700 rounded-md">
          <p className="font-bold">Error:</p>
          <p>{aiSummary}</p>
        </div>
      )}
      {aiSummaryStatus === 'completed' && aiSummary && (
        <div className="mt-6 p-6 border rounded-lg bg-white shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Your AI-Generated Tax Summary:</h3>
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
            <ReactMarkdown>{aiSummary}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="p-4 border-l-4 border-yellow-500 bg-yellow-100 rounded-md mt-8">
         <p className="font-bold text-yellow-800">Important Disclaimer:</p>
         <p className="text-sm text-yellow-700">
            The information provided by the AI is for informational purposes only and DOES NOT constitute financial or tax advice.
            It is AI-generated and may not be complete, accurate, or up-to-date.
            Always consult with a qualified tax professional for advice tailored to your specific situation and refer to official tax documents and software for filing.
         </p>
      </div>
    </div>
  );
};

export default AISummary;
