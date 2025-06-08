import React from 'react';
import './App.css'; // Assuming some base App.css might exist or be minimal
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MultiStepForm from './components/form/MultiStepForm';
import { FormProvider } from './context/FormContext';

function App() {
  return (
    <FormProvider>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow">
          <MultiStepForm />
        </main>
        <Footer />
      </div>
    </FormProvider>
  );
}

export default App;
