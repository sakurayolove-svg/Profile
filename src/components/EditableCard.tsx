import React, { useState } from 'react';
import { Trash2, Save, X, Edit3 } from 'lucide-react';
import { PageItem, FileItem } from '@/types';
import { FileUploader } from './FileUploader';
import { ImageViewer } from './ImageViewer';
import { PDFViewer } from './PDFViewer';

interface EditableCardProps {
  item: PageItem;
  onUpdate: (id: string, updates: Partial<PageItem>) => void;
  onDelete: (id: string) => void;
}

export const EditableCard: React.FC<EditableCardProps> = ({ 
  item, 
  onUpdate, 
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.content);
  const [editFiles, setEditFiles] = useState<FileItem[]>(item.files);
  const [viewingImage, setViewingImage] = useState(false);
  const [viewingImageIndex, setViewingImageIndex] = useState(0);
  const [viewingPdf, setViewingPdf] = useState<FileItem | null>(null);

  const handleSave = () => {
    onUpdate(item.id, {
      title: editTitle,
      content: editContent,
      files: editFiles,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditFiles(item.files);
    setIsEditing(false);
  };

  const handleFileUpload = (newFiles: FileItem[]) => {
    setEditFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileDelete = (fileId: string) => {
    setEditFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const imageFiles = item.files.filter(f => f.type === 'image');
  const pdfFiles = item.files.filter(f => f.type === 'pdf');
  const firstImage = imageFiles[0];

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="标题"
            className="flex-1 text-lg font-semibold border-b-2 border-transparent 
                     focus:border-primary focus:outline-none bg-transparent"
          />
        </div>

        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="内容描述..."
          rows={4}
          className="w-full resize-none border rounded-lg p-3 focus:border-primary 
                   focus:outline-none text-gray-700"
        />

        <FileUploader 
          onUpload={handleFileUpload}
          existingFiles={editFiles}
          onDelete={handleFileDelete}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg 
                     flex items-center gap-1 transition-colors"
          >
            <X className="w-4 h-4" /> 取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-lg 
                     flex items-center gap-1 hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" /> 保存
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 
                    hover:shadow-md transition-shadow group">
        <div className="flex gap-5">
          {firstImage && (
            <button
              onClick={() => {
                setViewingImageIndex(0);
                setViewingImage(true);
              }}
              className="shrink-0 w-32 h-24 sm:w-40 sm:h-28 rounded-lg overflow-hidden bg-gray-100 
                       hover:opacity-90 transition-opacity"
            >
              <img 
                src={firstImage.data} 
                alt={firstImage.name}
                className="w-full h-full object-cover"
              />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {item.content && (
              <p className="mt-2 text-gray-600 whitespace-pre-wrap line-clamp-4">{item.content}</p>
            )}

            {item.files.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {imageFiles.length > 1 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {imageFiles.length} 张图片
                  </span>
                )}
                {pdfFiles.length > 0 && (
                  <button
                    onClick={() => setViewingPdf(pdfFiles[0])}
                    className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100"
                  >
                    {pdfFiles.length} 个 PDF
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {viewingImage && (
        <ImageViewer 
          files={item.files} 
          initialIndex={viewingImageIndex}
          onClose={() => setViewingImage(false)} 
        />
      )}

      {viewingPdf && (
        <PDFViewer 
          pdfData={viewingPdf.data}
          fileName={viewingPdf.name}
          onClose={() => setViewingPdf(null)}
        />
      )}
    </>
  );
};
