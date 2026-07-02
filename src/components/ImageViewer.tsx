import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { FileItem } from '@/types';

interface ImageViewerProps {
  files: FileItem[];
  initialIndex?: number;
  onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ 
  files, 
  initialIndex = 0, 
  onClose 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  const imageFiles = files.filter(f => f.type === 'image');
  const currentImage = imageFiles[currentIndex];

  if (!currentImage) return null;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : imageFiles.length - 1));
    setZoom(1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < imageFiles.length - 1 ? prev + 1 : 0));
    setZoom(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 
                 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative max-w-[90vw] max-h-[85vh]">
        <img
          src={currentImage.data}
          alt={currentImage.name}
          className="max-w-full max-h-[85vh] object-contain transition-transform"
          style={{ transform: `scale(${zoom})` }}
        />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 
                    bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
        <button onClick={handlePrev} className="text-white hover:text-gray-300">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-white text-sm">
          {currentIndex + 1} / {imageFiles.length}
        </span>

        <button onClick={handleNext} className="text-white hover:text-gray-300">
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="w-px h-5 bg-white/30" />

        <button 
          onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
          className="text-white hover:text-gray-300"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-white text-xs">{Math.round(zoom * 100)}%</span>

        <button 
          onClick={() => setZoom(z => Math.min(3, z + 0.25))}
          className="text-white hover:text-gray-300"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
