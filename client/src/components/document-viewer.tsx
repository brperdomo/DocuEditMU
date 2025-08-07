import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DocumentPage, Paragraph } from "@shared/schema";
import EditableParagraph from "./editable-paragraph";
import FloatingEditToolbar from "./floating-edit-toolbar";

interface DocumentViewerProps {
  documentId: string;
  currentPageNumber: number;
  totalPages: number;
  zoomLevel: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export default function DocumentViewer({
  documentId,
  currentPageNumber,
  totalPages,
  zoomLevel,
  onPreviousPage,
  onNextPage
}: DocumentViewerProps) {
  const [selectedParagraphId, setSelectedParagraphId] = useState<string | null>(null);

  const { data: pages = [] } = useQuery<DocumentPage[]>({
    queryKey: ['/api/documents', documentId, 'pages'],
  });

  const { data: paragraphs = [] } = useQuery<Paragraph[]>({
    queryKey: ['/api/documents', documentId, 'paragraphs'],
    enabled: pages.length > 0
  });

  const currentPage = pages.find(page => page.pageNumber === currentPageNumber);
  const pageParagraphs = paragraphs
    .filter(p => p.pageId === currentPage?.id)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const handleFormatting = (action: string) => {
    // TODO: Implement text formatting
    console.log('Format action:', action);
  };

  const handleCopyParagraph = () => {
    // TODO: Implement copy functionality
    console.log('Copy paragraph');
  };

  const handleDeleteParagraph = () => {
    // TODO: Implement delete functionality
    console.log('Delete paragraph');
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto relative">
        
        <FloatingEditToolbar
          isVisible={selectedParagraphId !== null}
          onBold={() => handleFormatting('bold')}
          onItalic={() => handleFormatting('italic')}
          onUnderline={() => handleFormatting('underline')}
          onCopy={handleCopyParagraph}
          onDelete={handleDeleteParagraph}
        />

        {/* Document Page */}
        <div 
          className="bg-white document-shadow rounded-lg mb-8 relative"
          style={{ 
            width: `${794 * zoomLevel}px`, 
            minHeight: `${1123 * zoomLevel}px`,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top left'
          }}
        >
          
          {/* Page Header */}
          <div className="absolute top-4 right-4 text-xs text-gray-400">
            Page {currentPageNumber} of {totalPages}
          </div>
          
          {/* Document Content */}
          <div className="p-16 space-y-6">
            
            {/* Document Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-docusign-charcoal mb-2">
                SERVICE AGREEMENT CONTRACT
              </h1>
              <p className="text-gray-600">Effective Date: January 1, 2024</p>
            </div>
            
            {/* Paragraphs */}
            {pageParagraphs.map((paragraph) => (
              <EditableParagraph
                key={paragraph.id}
                paragraph={paragraph}
                documentId={documentId}
                onSelect={() => setSelectedParagraphId(paragraph.id)}
                isSelected={selectedParagraphId === paragraph.id}
                isRecentlyPasted={false}
              />
            ))}

            {/* Signature Section Placeholder */}
            <div className="mt-12 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="h-12 border-b-2 border-gray-300 flex items-end pb-1">
                    <span className="text-gray-500 text-sm">Client Signature</span>
                  </div>
                  <p className="text-xs text-gray-500">Name: ________________________</p>
                  <p className="text-xs text-gray-500">Date: ________________________</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 border-b-2 border-gray-300 flex items-end pb-1">
                    <span className="text-gray-500 text-sm">Service Provider Signature</span>
                  </div>
                  <p className="text-xs text-gray-500">Name: ________________________</p>
                  <p className="text-xs text-gray-500">Date: ________________________</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page Navigation at Bottom */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button 
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:border-docusign-blue hover:text-docusign-blue transition-colors"
            onClick={onPreviousPage}
            disabled={currentPageNumber <= 1}
          >
            <i className="fas fa-chevron-left mr-2"></i>Previous Page
          </button>
          <div className="flex space-x-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <div 
                key={i + 1}
                className={`w-2 h-2 rounded-full ${
                  i + 1 === currentPageNumber ? 'bg-docusign-blue' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <button 
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:border-docusign-blue hover:text-docusign-blue transition-colors"
            onClick={onNextPage}
            disabled={currentPageNumber >= totalPages}
          >
            Next Page<i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
