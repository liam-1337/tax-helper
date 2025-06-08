import React, { useState } from 'react';
import { useFormContext } from '../contexts/FormContext';
import { createWorker } from 'tesseract.js';

const DocumentUpload: React.FC = () => {
  const { formData, updateUploadedDocuments, updateExtractedTexts, addExtractedTextEntry, setSpecificExtractedText } = useFormContext();
  const [fileError, setFileError] = useState<string | null>(null);

  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null); // Clear previous error

    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const validFiles = [];
      let currentError = null;

      for (const file of newFiles) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
          currentError = `File "${file.name}" is too large (max ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB).`;
          break;
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          currentError = `File type for "${file.name}" is not supported (allowed: PDF, JPG, PNG).`;
          break;
        }
        validFiles.push(file);
      }

      if (currentError) {
        setFileError(currentError);
        // Do not add any files if one is invalid, to avoid partial uploads from a single selection
      } else {
        if (validFiles.length > 0) {
          const updatedDocumentList = [...formData.uploadedDocuments, ...validFiles];
          updateUploadedDocuments(updatedDocumentList);
          validFiles.forEach(vf => addExtractedTextEntry(vf.name));
        }
      }
      // Clear the file input so the same file can be re-selected if removed and then added again
      event.target.value = "";
    }
  };

  const handleRemoveFile = (fileIndex: number) => {
    const updatedFiles = formData.uploadedDocuments.filter((_, index) => index !== fileIndex);
    const updatedTexts = formData.extractedTexts.filter((_, index) => index !== fileIndex);
    updateUploadedDocuments(updatedFiles);
    updateExtractedTexts(updatedTexts);
  };

  const handleProcessText = async (file: File, index: number) => {
    setSpecificExtractedText(index, { status: 'processing', progress: 0, text: '' });

    try {
      const worker = await createWorker({
        logger: m => {
          if (m.status === 'recognizing text') {
            setSpecificExtractedText(index, { progress: m.progress });
          }
          console.log(m);
        },
      });
      await worker.loadLanguage('eng+deu');
      await worker.initialize('eng+deu');
      const { data: { text } } = await worker.recognize(file);
      setSpecificExtractedText(index, { text, status: 'completed', progress: 1 });
      await worker.terminate();
    } catch (error) {
      console.error("OCR Error:", error);
      setSpecificExtractedText(index, { status: 'error', text: `OCR failed for ${file.name}. Check file or try again.` });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center">Document Upload</h2>
      <div className="mb-6">
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
          Upload Supporting Documents
        </label>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(',')}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-100 file:text-blue-700
                     hover:file:bg-blue-200
                     cursor-pointer"
        />
        <p className="mt-1 text-xs text-gray-500">Allowed types: PDF, JPG, PNG. Max size: {MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.</p>
        {fileError && <p className="text-sm text-red-600 mt-2">{fileError}</p>}
      </div>

      {formData.uploadedDocuments.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mb-3 text-gray-800">Uploaded Files:</h3>
          <ul className="space-y-3">
            {formData.uploadedDocuments.map((file, index) => {
              const extractedInfo = formData.extractedTexts[index];
              return (
                <li
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700 truncate font-medium" title={file.name}>
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="ml-3 text-red-600 hover:text-red-800 font-medium text-xs px-2 py-1 rounded-md hover:bg-red-100 transition-colors duration-150"
                      aria-label={`Remove ${file.name}`}
                    >
                      Remove
                    </button>
                  </div>

                  {extractedInfo && (
                    <div className="mt-2">
                      { (extractedInfo.status === 'idle' || extractedInfo.status === 'error') && ! (extractedInfo.status === 'processing') &&
                        <button
                          onClick={() => handleProcessText(file, index)}
                          disabled={extractedInfo.status === 'processing'}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-xs transition-colors duration-150 disabled:opacity-50"
                        >
                          Extract Text
                        </button>
                      }
                      { extractedInfo.status === 'processing' && (
                        <div className="flex items-center my-1">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-150"
                              style={{ width: `${(extractedInfo.progress * 100).toFixed(0)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-blue-600 whitespace-nowrap">({(extractedInfo.progress * 100).toFixed(0)}%)</p>
                        </div>)
                      }
                      {extractedInfo.status !== 'processing' && extractedInfo.status !== 'idle' && extractedInfo.text && (
                        <div className="mt-2">
                          <h4 className="text-xs font-semibold mt-1 mb-1 text-gray-600">
                            {extractedInfo.status === 'completed' ? 'Extracted Text (Editable):' : 'OCR Status:'}
                          </h4>
                          <textarea
                            value={extractedInfo.text}
                            onChange={(e) => setSpecificExtractedText(index, { text: e.target.value })}
                            readOnly={extractedInfo.status === 'error'}
                            className={`w-full p-2 border border-gray-300 rounded mt-1 h-24 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${extractedInfo.status === 'error' ? 'text-red-700 bg-red-50' : ''}`}
                            placeholder={extractedInfo.status === 'completed' ? "Extracted text will appear here. You can edit it." : ""}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
