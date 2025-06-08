import React from 'react';
import { useFormContext } from '../../context/FormContext';

const ReviewStep: React.FC = () => {
  const { formData } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-700">
        Review Your Information
      </h3>
      <p className="text-sm text-gray-600">
        Please review all the information you&apos;ve entered and uploaded
        before generating the AI summary.
      </p>
      {/* Content to display formData.personal, formData.income, etc. will be added later */}
      <pre className="bg-gray-50 p-4 rounded overflow-auto text-xs">
        {JSON.stringify(formData, null, 2)}
      </pre>
      <p className="text-sm text-gray-500 mt-4">
        (Detailed display of each section will be implemented here. For now,
        showing raw JSON.)
      </p>
    </div>
  );
};
export default ReviewStep;
