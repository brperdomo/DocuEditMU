import { Button } from "@/components/ui/button";
import { PDFField } from "@/pages/pdf-editor";

interface PDFFieldPaletteProps {
  onAddField: (type: PDFField['type']) => void;
}

const fieldTypes = [
  { 
    type: 'signature' as const, 
    label: 'Signature', 
    icon: 'fas fa-signature', 
    description: 'Digital signature field',
    color: 'bg-yellow-500'
  },
  { 
    type: 'date' as const, 
    label: 'Date', 
    icon: 'fas fa-calendar', 
    description: 'Date field',
    color: 'bg-blue-500'
  },
  { 
    type: 'name' as const, 
    label: 'Full Name', 
    icon: 'fas fa-user', 
    description: 'Full name field',
    color: 'bg-green-500'
  },
  { 
    type: 'initial' as const, 
    label: 'Initial', 
    icon: 'fas fa-pen-fancy', 
    description: 'Initial field',
    color: 'bg-purple-500'
  },
  { 
    type: 'text' as const, 
    label: 'Text', 
    icon: 'fas fa-font', 
    description: 'Text input field',
    color: 'bg-gray-500'
  },
  { 
    type: 'email' as const, 
    label: 'Email', 
    icon: 'fas fa-at', 
    description: 'Email address field',
    color: 'bg-indigo-500'
  },
  { 
    type: 'title' as const, 
    label: 'Job Title', 
    icon: 'fas fa-briefcase', 
    description: 'Job title field',
    color: 'bg-teal-500'
  },
  { 
    type: 'checkbox' as const, 
    label: 'Checkbox', 
    icon: 'fas fa-check-square', 
    description: 'Checkbox field',
    color: 'bg-red-500'
  }
];

export default function PDFFieldPalette({ onAddField }: PDFFieldPaletteProps) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-docusign-charcoal mb-2 uppercase tracking-wide">
          Document Fields
        </h3>
        <p className="text-xs text-gray-500">Click to add fields to your PDF</p>
      </div>
      
      <div className="space-y-3">
        {fieldTypes.map((fieldType) => (
          <Button
            key={fieldType.type}
            variant="ghost"
            className="w-full justify-start p-3 h-auto hover:bg-docusign-light-grey group"
            onClick={() => onAddField(fieldType.type)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 ${fieldType.color} text-white rounded flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <i className={`${fieldType.icon} text-xs`}></i>
              </div>
              <div className="text-left flex-1">
                <div className="text-sm font-medium text-docusign-charcoal">
                  {fieldType.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {fieldType.description}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gradient-to-br from-docusign-blue/10 to-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <i className="fas fa-lightbulb text-docusign-blue mt-0.5"></i>
          <div>
            <h4 className="text-sm font-medium text-docusign-blue">How to use</h4>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Click a field type to add it to the PDF</li>
              <li>• Drag fields to position them precisely</li>
              <li>• Click fields to configure properties</li>
              <li>• Assign fields to different signers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}