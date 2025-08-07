interface PageThumbnailProps {
  pageNumber: number;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PageThumbnail({ pageNumber, isActive, onSelect, onEdit, onDelete }: PageThumbnailProps) {
  return (
    <div 
      className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
        isActive 
          ? 'bg-docusign-blue bg-opacity-10 border-docusign-blue' 
          : 'bg-white hover:border-docusign-blue'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-2">
        <div className={`w-8 h-10 border rounded flex items-center justify-center text-xs ${
          isActive 
            ? 'bg-docusign-blue text-white' 
            : 'bg-gray-100'
        }`}>
          {pageNumber}
        </div>
        <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>
          Page {pageNumber}
        </span>
      </div>
      <div className="flex space-x-1">
        <button 
          className={`hover:text-docusign-blue ${
            isActive ? 'text-docusign-blue' : 'text-gray-400'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title="Edit page"
        >
          <i className="fas fa-edit text-xs"></i>
        </button>
        <button 
          className="text-gray-400 hover:text-docusign-red"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete page"
        >
          <i className="fas fa-trash text-xs"></i>
        </button>
      </div>
    </div>
  );
}
