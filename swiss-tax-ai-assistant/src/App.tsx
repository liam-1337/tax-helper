import React, { useState } from 'react';
import { FormProvider } from './contexts/FormContext';
import PersonalData from './components/PersonalData';
import Income from './components/Income';
import Deductions from './components/Deductions';
import DocumentUpload from './components/DocumentUpload';
import Review from './components/Review';
import AISummary from './components/AISummary';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6; // PersonalData, Income, Deductions, DocumentUpload, Review, AISummary

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PersonalData />;
      case 2: return <Income />;
      case 3: return <Deductions />;
      case 4: return <DocumentUpload />;
      case 5: return <Review />;
      case 6: return <AISummary />;
      default: return <PersonalData />;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Swiss Tax AI Assistant</h1>
      <FormProvider>
        <div className="flex justify-center items-center space-x-2 mb-6 p-4 bg-gray-100 rounded-lg shadow">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium
                          ${currentStep === step ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-300 border-gray-400 text-gray-700'}`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="form-content p-6 border rounded-lg shadow-lg bg-white min-h-[200px]">
          {renderStep()}
        </div>
      </FormProvider>
      <div className="navigation-buttons mt-6 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === totalSteps}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
