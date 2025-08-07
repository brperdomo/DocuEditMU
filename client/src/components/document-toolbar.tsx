import { Button } from "@/components/ui/button";

interface DocumentToolbarProps {
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSaving?: boolean;
  isPublishing?: boolean;
}

export default function DocumentToolbar({
  currentPage,
  totalPages,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onPreviousPage,
  onNextPage,
  onSaveDraft,
  onPublish,
  isSaving,
  isPublishing
}: DocumentToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-gray-600 hover:text-docusign-blue hover:bg-gray-100 rounded transition-colors"
            title="Zoom out"
            onClick={onZoomOut}
          >
            <i className="fas fa-search-minus"></i>
          </button>
          <span className="text-sm font-medium">{Math.round(zoomLevel * 100)}%</span>
          <button 
            className="p-2 text-gray-600 hover:text-docusign-blue hover:bg-gray-100 rounded transition-colors"
            title="Zoom in"
            onClick={onZoomIn}
          >
            <i className="fas fa-search-plus"></i>
          </button>
        </div>
        
        <div className="h-6 w-px bg-gray-300"></div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-gray-600 hover:text-docusign-blue hover:bg-gray-100 rounded transition-colors"
            title="Previous page"
            onClick={onPreviousPage}
            disabled={currentPage <= 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="text-sm">
            {currentPage} of {totalPages}
          </span>
          <button 
            className="p-2 text-gray-600 hover:text-docusign-blue hover:bg-gray-100 rounded transition-colors"
            title="Next page"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          variant="secondary"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          onClick={onSaveDraft}
          disabled={isSaving}
        >
          <i className="fas fa-save mr-2"></i>
          {isSaving ? 'Saving...' : 'Save Draft'}
        </Button>
        <Button 
          className="px-4 py-2 bg-docusign-success text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          onClick={onPublish}
          disabled={isPublishing}
        >
          <i className="fas fa-check mr-2"></i>
          {isPublishing ? 'Publishing...' : 'Publish Changes'}
        </Button>
      </div>
    </div>
  );
}
