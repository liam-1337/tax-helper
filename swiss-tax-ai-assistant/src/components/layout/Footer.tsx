import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Swiss Tax AI Assistant. For
          informational purposes only.
        </p>
        <p className="text-sm text-gray-400">
          This is not financial or tax advice.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
