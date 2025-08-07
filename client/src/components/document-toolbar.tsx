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
    <div className="bg-white border-b border-docusign-medium-grey p-3 flex items-center justify-between shadow-sm">
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
          className="px-4 py-2 bg-docusign-medium-grey text-docusign-charcoal rounded-md hover:bg-docusign-light-grey transition-colors text-sm font-medium"
          onClick={onSaveDraft}
          disabled={isSaving}
        >
          <i className="fas fa-save mr-2 text-xs"></i>
          {isSaving ? 'Saving...' : 'Save Draft'}
        </Button>
        <Button 
          className="px-4 py-2 bg-docusign-success text-white rounded-md hover:opacity-90 transition-all text-sm font-medium shadow-sm"
          onClick={onPublish}
          disabled={isPublishing}
        >
          <i className="fas fa-check mr-2 text-xs"></i>
          {isPublishing ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </div>
  );
}
