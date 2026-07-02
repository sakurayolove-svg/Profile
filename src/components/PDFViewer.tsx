import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// 设置 pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfData: string; // base64 data URL
  fileName: string;
  onClose: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfData, fileName, onClose }) => {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const base64Data = pdfData.split(',')[1];
        const raw = atob(base64Data);
        const uint8Array = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) {
          uint8Array[i] = raw.charCodeAt(i);
        }

        const loadedPdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
        setPdf(loadedPdf);
        setTotalPages(loadedPdf.numPages);
        setLoading(false);
      } catch (error) {
        console.error('PDF加载失败:', error);
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdfData]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    const renderPage = async () => {
      const page = await pdf.getPage(currentPage);
      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d')!;

      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
    };

    renderPage();
  }, [pdf, currentPage, scale]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        <div className="flex items-center gap-4">
          <h3 className="text-white font-medium truncate max-w-md">{fileName}</h3>
          <span className="text-gray-400 text-sm">
            {currentPage} / {totalPages}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-gray-300 text-sm w-16 text-center">
            {Math.round(scale * 100)}%
          </span>

          <button 
            onClick={() => setScale(s => Math.min(3, s + 0.2))}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-700" />

          <button 
            onClick={handleDownload}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF 内容 */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {loading ? (
          <div className="text-white">加载中...</div>
        ) : (
          <canvas ref={canvasRef} className="shadow-2xl" />
        )}
      </div>

      {/* 底部翻页 */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 bg-gray-900">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="p-2 text-gray-300 hover:text-white disabled:opacity-30 
                   disabled:cursor-not-allowed hover:bg-white/10 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) setCurrentPage(page);
          }}
          className="w-16 text-center bg-gray-800 text-white rounded-lg py-1 px-2 
                   border border-gray-700 focus:border-primary focus:outline-none"
        />

        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className="p-2 text-gray-300 hover:text-white disabled:opacity-30 
                   disabled:cursor-not-allowed hover:bg-white/10 rounded-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
