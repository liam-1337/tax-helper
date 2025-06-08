import React from 'react';
import { useFormContext } from '../../context/FormContext';
// Placeholder components for each step will be created later
import PersonalDataStep from './PersonalDataStep';
import IncomeDataStep from './IncomeDataStep';
import DeductionsDataStep from './DeductionsDataStep';
import DocumentUploadStep from './DocumentUploadStep';
import ReviewStep from './ReviewStep';
import AISummaryStep from './AISummaryStep';

const MultiStepForm: React.FC = () => {
  const { currentStep, setCurrentStep } = useFormContext();

  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalDataStep />;
      case 'income':
        return <IncomeDataStep />;
      case 'deductions':
        return <DeductionsDataStep />;
      case 'documents':
        return <DocumentUploadStep />;
      case 'review':
        return <ReviewStep />;
      case 'summary':
        return <AISummaryStep />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  // Basic navigation (will be improved)
  const handleNext = () => {
    if (currentStep === 'personal') setCurrentStep('income');
    else if (currentStep === 'income') setCurrentStep('deductions');
    else if (currentStep === 'deductions') setCurrentStep('documents');
    else if (currentStep === 'documents')
      setCurrentStep('review'); // New: documents -> review
    else if (currentStep === 'review') setCurrentStep('summary'); // New: review -> summary
  };

  const handlePrev = () => {
    if (currentStep === 'summary')
      setCurrentStep('review'); // New: summary -> review
    else if (currentStep === 'review')
      setCurrentStep('documents'); // New: review -> documents
    else if (currentStep === 'documents') setCurrentStep('deductions');
    else if (currentStep === 'deductions') setCurrentStep('income');
    else if (currentStep === 'income') setCurrentStep('personal');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="progress-bar mb-8">
        {' '}
        {/* Placeholder for progress bar */}
        <h2 className="text-xl font-semibold">
          Current Step: {currentStep.toUpperCase()}
        </h2>
      </div>
      <div className="form-content mb-8">{renderStep()}</div>
      <div className="navigation-buttons flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 'personal'}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === 'summary'} // Now summary is the last step
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MultiStepForm;
