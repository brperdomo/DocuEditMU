import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/app-header";
import Sidebar from "@/components/sidebar";
import DocumentToolbar from "@/components/document-toolbar";
import DocumentViewer from "@/components/document-viewer";
import { Document } from "@shared/schema";

export default function DocumentEditor() {
  const { documentId } = useParams<{ documentId: string }>();
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1.25);

  const { data: document, isLoading } = useQuery<Document>({
    queryKey: ['/api/documents', documentId],
  });

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handlePreviousPage = () => {
    setCurrentPageNumber(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPageNumber(prev => Math.min(prev + 1, document?.totalPages || 1));
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log('Save draft');
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publish document');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-docusign-light-grey flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-docusign-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-docusign-charcoal">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-docusign-light-grey flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-file-times text-4xl text-gray-400 mb-4"></i>
          <p className="text-docusign-charcoal">Document not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter bg-docusign-light-grey min-h-screen">
      <AppHeader />
      
      <div className="flex h-screen">
        <Sidebar
          documentId={documentId!}
          currentPageNumber={currentPageNumber}
          onPageSelect={setCurrentPageNumber}
        />
        
        <main className="flex-1 flex flex-col">
          <DocumentToolbar
            currentPage={currentPageNumber}
            totalPages={document.totalPages}
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
          />
          
          <DocumentViewer
            documentId={documentId!}
            currentPageNumber={currentPageNumber}
            totalPages={document.totalPages}
            zoomLevel={zoomLevel}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        </main>
      </div>

      {/* Contextual Help */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-docusign-blue text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center" title="Help & Support">
          <i className="fas fa-question text-lg"></i>
        </button>
      </div>

      {/* Status Indicator */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 glass-effect rounded-lg px-4 py-2 shadow-lg">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-docusign-success rounded-full animate-pulse"></div>
          <span className="text-gray-700">All changes saved</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">Last saved: 2:34 PM</span>
        </div>
      </div>
    </div>
  );
}
