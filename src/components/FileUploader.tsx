import React, { useId, useState } from 'react';
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
  const inputId = useId();

  const processFile = async (file: globalThis.File): Promise<FileItem> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other',
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
    onUpload(await Promise.all(Array.from(files).map(processFile)));
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        style={{
          border: `2px dashed ${isDragging ? '#224b8d' : '#ddd'}`,
          borderRadius: 4,
          padding: '1.5em',
          textAlign: 'center',
          background: isDragging ? '#f0f4fa' : '#fafafa',
          cursor: 'pointer',
        }}
      >
        <input type="file" multiple accept="image/*,application/pdf" id={inputId} onChange={e => handleFiles(e.target.files)} style={{ display: 'none' }} />
        <label htmlFor={inputId} style={{ cursor: 'pointer', display: 'block' }}>
          <Upload size={32} style={{ margin: '0 auto 0.5em', color: '#7a8288' }} />
          <p style={{ fontSize: '0.9em', color: '#494e52' }}>拖拽文件到此处，或 <span style={{ color: '#224b8d', textDecoration: 'underline' }}>点击上传</span></p>
        </label>
      </div>

      {existingFiles.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {existingFiles.map(file => (
            <div key={file.id} style={{ position: 'relative' }}>
              {file.type === 'image' ? (
                <img src={file.data} alt={file.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 3 }} />
              ) : (
                <div style={{ aspectRatio: '1', background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>
                  <FileText size={24} style={{ color: '#c0392b' }} />
                  <span style={{ fontSize: '0.7em', textAlign: 'center', padding: '0 4px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                </div>
              )}
              {onDelete && (
                <button onClick={() => onDelete(file.id)} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#c0392b', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
