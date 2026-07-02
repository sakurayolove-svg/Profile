import React, { useState } from 'react';
import { GripVertical, Trash2, Save, X, Edit3, FileText, Image as ImageIcon } from 'lucide-react';
import { PageItem, FileItem } from '@/types';
import { FileUploader } from './FileUploader';
import { ImageViewer } from './ImageViewer';
import { PDFViewer } from './PDFViewer';

interface EditableCardProps {
  item: PageItem;
  onUpdate: (id: string, updates: Partial<PageItem>) => void;
  onDelete: (id: string) => void;
  // dragHandleProps?: any;
}

export const EditableCard: React.FC<EditableCardProps> = ({ 
  item, 
  onUpdate, 
  onDelete,
  // dragHandleProps 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.content);
  const [editFiles, setEditFiles] = useState<FileItem[]>(item.files);
  const [viewingImage, setViewingImage] = useState(false);
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
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing text-gray-300 
                                              group-hover:text-gray-400">
              <GripVertical className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
          </div>

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
          <p className="mt-3 text-gray-600 whitespace-pre-wrap">{item.content}</p>
        )}

        {/* 文件预览 */}
        {item.files.length > 0 && (
          <div className="mt-4 space-y-3">
            {/* 图片网格 */}
            {imageFiles.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {imageFiles.map((file, idx) => (
                  <button
                    key={file.id}
                    onClick={() => setViewingImage(true)}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100 
                             hover:opacity-90 transition-opacity"
                  >
                    <img 
                      src={file.data} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* PDF 列表 */}
            {pdfFiles.length > 0 && (
              <div className="space-y-2">
                {pdfFiles.map(file => (
                  <button
                    key={file.id}
                    onClick={() => setViewingPdf(file)}
                    className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-lg 
                             hover:bg-red-100 transition-colors text-left"
                  >
                    <FileText className="w-5 h-5 text-red-500 shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <span className="text-xs text-gray-400 ml-auto shrink-0">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 图片查看器 */}
      {viewingImage && (
        <ImageViewer 
          files={item.files} 
          onClose={() => setViewingImage(false)} 
        />
      )}

      {/* PDF 查看器 */}
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
