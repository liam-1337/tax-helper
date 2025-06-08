import React from 'react';
import { useFormContext } from '../contexts/FormContext';

const Review: React.FC = () => {
  const { formData } = useFormContext();

  const renderSection = (title: string, data: Record<string, any>) => {
    // Helper to format keys (e.g., camelCase to Title Case)
    const formatKey = (key: string) => {
      const result = key.replace(/([A-Z])/g, ' $1');
      return result.charAt(0).toUpperCase() + result.slice(1);
    };

    return (
      <div className="mb-8 p-4 border rounded-lg shadow-sm bg-white">
        <h3 className="text-xl font-semibold border-b border-gray-300 pb-3 mb-4 text-blue-600">{title}</h3>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-600 text-sm">{formatKey(key)}:</span>
            <span className="text-gray-800 text-sm">{String(value) || 'N/A'}</span>
          </div>
        ))}
        {Object.keys(data).length === 0 && <p className="text-sm text-gray-500">No data provided for this section.</p>}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Review Your Information</h2>

      {renderSection("Personal Information", formData.personalInfo)}
      {renderSection("Income", formData.income)}
      {renderSection("Deductions", formData.deductions)}

      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
        <h3 className="text-xl font-semibold border-b border-gray-300 pb-3 mb-4 text-blue-600">Uploaded Documents</h3>
        {formData.uploadedDocuments.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {formData.uploadedDocuments.map((doc, index) => (
              <li key={index} className="text-sm text-gray-700">{doc.name}</li>
            ))}
          </ul>
        ) : <p className="text-sm text-gray-500">No documents uploaded.</p>}
      </div>

      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
        <h3 className="text-xl font-semibold border-b border-gray-300 pb-3 mb-4 text-blue-600">Extracted Texts from Documents</h3>
        {formData.extractedTexts.filter(et => et.status === 'completed' && et.text.trim() !== '').length > 0 ? (
          formData.extractedTexts.map((doc, index) => (
            doc.status === 'completed' && doc.text.trim() !== '' && (
              <div key={index} className="mb-3">
                <p className="font-medium text-gray-600 text-sm">{doc.fileName}:</p>
                <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded text-xs text-gray-700 mt-1 max-h-32 overflow-y-auto">{doc.text}</pre>
              </div>
            )
          ))
        ) : <p className="text-sm text-gray-500">No text successfully extracted or available.</p>}
         {formData.extractedTexts.filter(et => et.status !== 'completed' || et.text.trim() === '').length > 0 &&
          formData.extractedTexts.filter(et => et.status === 'completed' && et.text.trim() !== '').length === 0 && (
          <p className="text-sm text-gray-500">Some documents may not have been processed for text extraction or yielded no text.</p>
        )}
      </div>

    </div>
  );
};

export default Review;
