// src/components/form/DocumentUploadStep.tsx
import React, { useState } from 'react'; // Removed useCallback as it wasn't used
import { useFormContext } from '../../context/FormContext';
import { UploadedDocument } from '../../types/formData';
import { createWorker } from 'tesseract.js'; // Removed PSM

const DocumentUploadStep: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [ocrProcessing, setOcrProcessing] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<Record<string, number>>({}); // Store progress per file

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
    setFeedbackMessage('');
    setOcrProgress({});
  };

  const processOcr = async (
    file: File,
    documentId: string
  ): Promise<string> => {
    setFeedbackMessage(
      (prev) =>
        prev +
        `
Starting OCR for ${file.name}...`
    );
    // Note: setOcrProcessing(true) is handled in the caller function for overall state

    const worker = await createWorker({
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setOcrProgress((prev) => ({
            ...prev,
            [documentId]: Math.round(m.progress * 100),
          }));
        }
        console.log(m); // For detailed logging in console
      },
    });

    try {
      await worker.loadLanguage('eng+deu'); // Example: English and German
      await worker.initialize('eng+deu');
      // More specific parameters can be set if needed, e.g., for better table recognition.
      // await worker.setParameters({
      //   tessedit_pageseg_mode: PSM.AUTO_OSD, // Or other PSM modes
      // });
      const {
        data: { text },
      } = await worker.recognize(file);
      await worker.terminate();
      setFeedbackMessage(
        (prev) =>
          prev +
          `
OCR complete for ${file.name}.`
      );
      return text;
    } catch (error) {
      console.error('OCR Error for file ' + file.name + ':', error);
      setFeedbackMessage(
        (prev) =>
          prev +
          `
OCR failed for ${file.name}.`
      );
      return ''; // Return empty string or handle error appropriately
    }
    // Removed finally block that was trying to setOcrProcessing(false) here,
    // it should be managed by the calling function after all files are processed.
  };

  const handleAddAndProcessFiles = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setFeedbackMessage('Please select one or more files.');
      return;
    }

    setOcrProcessing(true); // Set overall processing state
    setFeedbackMessage(''); // Clear previous messages, start fresh for this batch
    let currentDocuments = [...formData.documents];
    const filesToProcess = Array.from(selectedFiles); // Create a stable array

    for (const file of filesToProcess) {
      const documentId = `${Date.now()}-${file.name}`;
      const newDoc: UploadedDocument = {
        id: documentId,
        file: file,
        fileName: file.name,
        fileType: file.type,
        extractedText: 'Processing OCR...', // Initial state
      };
      currentDocuments = [...currentDocuments, newDoc];
      // Update UI immediately to show file is added and queued for OCR
      updateFormData({ documents: [...currentDocuments] });

      const extractedText = await processOcr(file, documentId);

      currentDocuments = currentDocuments.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              extractedText: extractedText || 'OCR failed or no text found.',
            }
          : doc
      );
      // Update UI with extracted text for this specific document
      updateFormData({ documents: [...currentDocuments] });
    }

    setOcrProcessing(false); // Clear overall processing state after all files
    setFeedbackMessage(
      (prev) =>
        prev.trim() +
        `
All selected files processed.`
    ); // Append to existing messages
    setSelectedFiles(null);
    const fileInput = document.getElementById(
      'fileUploadInput'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-700">
        Upload Documents & Extract Text
      </h3>
      {/* ... file input ... unchanged ... */}
      <div>
        <label
          htmlFor="fileUploadInput"
          className="block text-sm font-medium text-gray-700"
        >
          Select files (PDF, JPG, PNG):
        </label>
        <input
          type="file"
          id="fileUploadInput"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          disabled={ocrProcessing}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <button
        onClick={handleAddAndProcessFiles} // Changed from handleFileUpload
        disabled={!selectedFiles || selectedFiles.length === 0 || ocrProcessing}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {ocrProcessing
          ? 'Processing...'
          : 'Add & Extract Text from Selected Files'}
      </button>

      {feedbackMessage && (
        <p className="text-sm text-gray-600 whitespace-pre-line">
          {feedbackMessage}
        </p>
      )}

      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-700">
          Uploaded Documents:
        </h4>
        {formData.documents.length === 0 ? (
          <p className="text-sm text-gray-500">No documents uploaded yet.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-2 mt-2">
            {formData.documents.map((doc) => (
              <li key={doc.id} className="text-sm text-gray-700">
                <strong>{doc.fileName}</strong> ({doc.fileType})
                {ocrProgress[doc.id] && ocrProgress[doc.id] < 100 && (
                  <span className="ml-2 text-blue-500">
                    OCR: {ocrProgress[doc.id]}%
                  </span>
                )}
                {doc.extractedText === 'Processing OCR...' &&
                  !ocrProgress[doc.id] && (
                    <span className="ml-2 text-yellow-500">
                      {' '}
                      (Queued for OCR...)
                    </span>
                  )}
                {doc.extractedText &&
                  doc.extractedText !== 'Processing OCR...' && (
                    <details className="mt-1 text-xs text-gray-500">
                      <summary>
                        View Extracted Text ({doc.extractedText.length} chars)
                      </summary>
                      <pre className="mt-1 p-2 bg-gray-50 border rounded max-h-32 overflow-auto whitespace-pre-wrap">
                        {doc.extractedText}
                      </pre>
                    </details>
                  )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DocumentUploadStep;
