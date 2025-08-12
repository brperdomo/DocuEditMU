import { useDraggable } from '@dnd-kit/core';
import { Button } from "@/components/ui/button";
import { PDFField } from "@/pages/pdf-editor";

interface DraggableFieldProps {
  field: PDFField;
  isSelected: boolean;
  onClick: () => void;
  containerRef: React.RefObject<HTMLElement>;
}

const getFieldColor = (type: PDFField['type'], assignee?: PDFField['assignee']) => {
  const colors = {
    signature: 'border-yellow-400 bg-yellow-50',
    date: 'border-blue-400 bg-blue-50',
    name: 'border-green-400 bg-green-50',
    initial: 'border-purple-400 bg-purple-50',
    text: 'border-gray-400 bg-gray-50',
    email: 'border-indigo-400 bg-indigo-50',
    title: 'border-teal-400 bg-teal-50',
    checkbox: 'border-red-400 bg-red-50'
  };
  
  return colors[type] || 'border-gray-400 bg-gray-50';
};

const getAssigneeColor = (assignee?: PDFField['assignee']) => {
  switch (assignee) {
    case 'signer1': return 'bg-yellow-500';
    case 'signer2': return 'bg-green-500';
    case 'sender': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};

export default function DraggableField({
  field,
  isSelected,
  onClick,
  containerRef
}: DraggableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: field.id,
  });

  // Get container dimensions for percentage-based positioning
  const containerRect = containerRef.current?.getBoundingClientRect();
  const containerWidth = containerRect?.width || 612; // Default to standard document width
  const containerHeight = containerRect?.height || 792; // Default to standard document height

  // Convert percentage positions to pixels
  const pixelX = (field.x / 100) * containerWidth;
  const pixelY = (field.y / 100) * containerHeight;
  const pixelWidth = (field.width / 100) * containerWidth;
  const pixelHeight = (field.height / 100) * containerHeight;

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    left: pixelX,
    top: pixelY,
    width: pixelWidth,
    height: pixelHeight,
    zIndex: isDragging ? 1000 : isSelected ? 100 : 10,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        absolute border-2 rounded cursor-move transition-all duration-200 select-none
        ${getFieldColor(field.type, field.assignee)}
        ${isSelected ? 'ring-2 ring-docusign-blue ring-opacity-50 border-docusign-blue' : 'border-dashed'}
        ${isDragging ? 'shadow-lg' : 'hover:shadow-md'}
        group
      `}
      onClick={handleClick}
      {...listeners}
      {...attributes}
    >
      {/* Field Content */}
      <div className="w-full h-full flex items-center justify-center p-1 relative">
        {field.type === 'signature' && (
          <div className="text-center">
            <i className="fas fa-signature text-yellow-600 text-lg mb-1"></i>
            <div className="text-xs font-medium text-yellow-700">
              {field.value || field.placeholder}
            </div>
          </div>
        )}
        
        {field.type === 'date' && (
          <div className="text-center">
            <i className="fas fa-calendar text-blue-600 text-sm mb-1"></i>
            <div className="text-xs font-medium text-blue-700">
              {field.value || new Date().toLocaleDateString()}
            </div>
          </div>
        )}
        
        {field.type === 'checkbox' && (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-4 h-4 border-2 border-red-600 rounded bg-white flex items-center justify-center">
              {field.value && <i className="fas fa-check text-xs text-red-600"></i>}
            </div>
          </div>
        )}
        
        {field.type === 'initial' && (
          <div className="text-center">
            <i className="fas fa-pen-fancy text-purple-600 text-sm mb-1"></i>
            <div className="text-xs font-medium text-purple-700">
              {field.value || 'JD'}
            </div>
          </div>
        )}
        
        {(field.type === 'text' || field.type === 'name' || field.type === 'email' || field.type === 'title') && (
          <div className="text-xs font-medium text-gray-700 truncate px-1 w-full text-center">
            {field.value || field.placeholder}
          </div>
        )}

        {/* Assignee Indicator */}
        <div className={`absolute -top-2 -left-2 w-4 h-4 ${getAssigneeColor(field.assignee)} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
          {field.assignee === 'signer1' ? '1' : field.assignee === 'signer2' ? '2' : 'S'}
        </div>

        {/* Required Indicator */}
        {field.required && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        )}

        {/* Field Controls */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded shadow-lg flex">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              const newField = { ...field, id: `field_${Date.now()}` };
              // This would need to be handled by parent component
            }}
            className="w-6 h-6 p-0 hover:bg-blue-100"
            title="Duplicate field"
          >
            <i className="fas fa-copy text-xs text-blue-600"></i>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-6 h-6 p-0 hover:bg-red-100"
            title="Delete field"
          >
            <i className="fas fa-trash text-xs text-red-600"></i>
          </Button>
        </div>

        {/* Resize Handle */}
        {isSelected && (
          <div 
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-docusign-blue border border-white rounded cursor-nw-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              // Handle resize - would need more complex implementation
            }}
          ></div>
        )}
      </div>
    </div>
  );
}