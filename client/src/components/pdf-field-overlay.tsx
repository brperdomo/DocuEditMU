import { PDFField } from "@/pages/pdf-editor";

interface PDFFieldOverlayProps {
  field: PDFField;
  pageSize: { width: number; height: number };
  scale: number;
  isPreview?: boolean;
}

export default function PDFFieldOverlay({ 
  field, 
  pageSize, 
  scale, 
  isPreview = false 
}: PDFFieldOverlayProps) {
  // Convert percentage positions to pixels
  const pixelX = (field.x / 100) * pageSize.width * scale;
  const pixelY = (field.y / 100) * pageSize.height * scale;
  const pixelWidth = (field.width / 100) * pageSize.width * scale;
  const pixelHeight = (field.height / 100) * pageSize.height * scale;

  const style = {
    left: pixelX,
    top: pixelY,
    width: pixelWidth,
    height: pixelHeight,
  };

  if (isPreview) {
    // Render actual form elements for preview/signing
    switch (field.type) {
      case 'text':
      case 'name':
      case 'email':
      case 'title':
        return (
          <input
            type={field.type === 'email' ? 'email' : 'text'}
            placeholder={field.placeholder}
            className="absolute border border-gray-300 rounded px-2 py-1 text-sm"
            style={style}
            required={field.required}
          />
        );
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            className="absolute"
            style={style}
            required={field.required}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            className="absolute border border-gray-300 rounded px-2 py-1 text-sm"
            style={style}
            required={field.required}
          />
        );
      
      case 'signature':
      case 'initial':
        return (
          <div
            className="absolute border-2 border-dashed border-yellow-400 bg-yellow-50 flex items-center justify-center text-sm font-medium text-yellow-700"
            style={style}
          >
            {field.type === 'signature' ? 'Click to Sign' : 'Click for Initial'}
          </div>
        );
      
      default:
        return null;
    }
  }

  // Default editor view (handled by DraggableField)
  return null;
}