interface FloatingEditToolbarProps {
  isVisible: boolean;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

export default function FloatingEditToolbar({
  isVisible,
  onBold,
  onItalic,
  onUnderline,
  onCopy,
  onDelete
}: FloatingEditToolbarProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-8 z-40 glass-effect rounded-lg p-3 shadow-lg">
      <div className="flex items-center space-x-2">
        <button 
          className="p-2 text-gray-600 hover:text-docusign-blue hover:bg-gray-100 rounded transition-colors"
          title="Bold"
          onClick={onBold}
        >
          <i className="fas fa-bold text-sm"></i>
        </button>
        <button 
          className="p-2 text-gray-600 hover:text-docusign-blue hover:bg-gray-100 rounded transition-colors"
          title="Italic"
          onClick={onItalic}
        >
          <i className="fas fa-italic text-sm"></i>
        </button>
        <button 
          className="p-2 text-gray-600 hover:text-docusign-blue hover:bg-gray-100 rounded transition-colors"
          title="Underline"
          onClick={onUnderline}
        >
          <i className="fas fa-underline text-sm"></i>
        </button>
        <div className="h-6 w-px bg-gray-300"></div>
        <button 
          className="p-2 text-gray-600 hover:text-docusign-blue hover:bg-gray-100 rounded transition-colors"
          title="Copy paragraph"
          onClick={onCopy}
        >
          <i className="fas fa-copy text-sm"></i>
        </button>
        <button 
          className="p-2 text-gray-600 hover:text-docusign-red hover:bg-gray-100 rounded transition-colors"
          title="Delete paragraph"
          onClick={onDelete}
        >
          <i className="fas fa-trash text-sm"></i>
        </button>
      </div>
    </div>
  );
}
