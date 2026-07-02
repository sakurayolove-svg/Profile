import React, { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { FileItem } from '@/types';

interface FileUploaderProps {
  onUpload: (files: FileItem[]) => void;
  existingFiles?: FileItem[];
  onDelete?: (fileId: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onUpload, 
  existingFiles = [], 
  onDelete 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: globalThis.File): Promise<FileItem> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';

        resolve({
          id: crypto.randomUUID(),
          name: file.name,
          type: isImage ? 'image' : isPdf ? 'pdf' : 'other',
          size: file.size,
          data: reader.result as string,
          mimeType: file.type,
          createdAt: Date.now(),
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: globalThis.FileList | null) => {
    if (!files) return;
    const processedFiles = await Promise.all(
      Array.from(files).map(processFile)
    );
    onUpload(processedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-primary bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">
            拖拽文件到此处，或 <span className="text-primary underline">点击上传</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">支持图片和 PDF</p>
        </label>
      </div>

      {existingFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {existingFiles.map(file => (
            <div key={file.id} className="relative group">
              {file.type === 'image' ? (
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={file.data} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-red-50 flex flex-col items-center justify-center p-3">
                  <FileText className="w-10 h-10 text-red-500 mb-2" />
                  <p className="text-xs text-center text-gray-600 truncate w-full">
                    {file.name}
                  </p>
                </div>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(file.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full 
                           flex items-center justify-center opacity-0 group-hover:opacity-100 
                           transition-opacity shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
