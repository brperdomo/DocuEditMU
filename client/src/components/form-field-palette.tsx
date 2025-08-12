import { Button } from "@/components/ui/button";
import { FormField } from "@/pages/form-builder";

interface FormFieldPaletteProps {
  onAddField: (type: FormField['type']) => void;
}

const fieldTypes = [
  { type: 'text' as const, label: 'Text Input', icon: 'fas fa-font', description: 'Single line text input' },
  { type: 'email' as const, label: 'Email', icon: 'fas fa-at', description: 'Email address input' },
  { type: 'textarea' as const, label: 'Text Area', icon: 'fas fa-align-left', description: 'Multi-line text input' },
  { type: 'select' as const, label: 'Dropdown', icon: 'fas fa-chevron-down', description: 'Select from options' },
  { type: 'checkbox' as const, label: 'Checkbox', icon: 'fas fa-check-square', description: 'Multiple choice selection' },
  { type: 'radio' as const, label: 'Radio Button', icon: 'fas fa-dot-circle', description: 'Single choice selection' },
  { type: 'date' as const, label: 'Date', icon: 'fas fa-calendar', description: 'Date picker input' },
  { type: 'signature' as const, label: 'Signature', icon: 'fas fa-signature', description: 'Digital signature field' }
];

export default function FormFieldPalette({ onAddField }: FormFieldPaletteProps) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-docusign-charcoal mb-2 uppercase tracking-wide">
          Form Fields
        </h3>
        <p className="text-xs text-gray-500">Click to add fields to your form</p>
      </div>
      
      <div className="space-y-2">
        {fieldTypes.map((fieldType) => (
          <Button
            key={fieldType.type}
            variant="ghost"
            className="w-full justify-start p-3 h-auto hover:bg-docusign-light-grey"
            onClick={() => onAddField(fieldType.type)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-docusign-blue text-white rounded flex items-center justify-center flex-shrink-0">
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
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Pro Tip</h4>
            <p className="text-xs text-blue-700 mt-1">
              After adding fields, drag them to reorder and click to configure properties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}