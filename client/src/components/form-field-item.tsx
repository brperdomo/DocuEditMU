import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField } from "@/pages/form-builder";

interface FormFieldItemProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function FormFieldItem({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate
}: FormFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            placeholder={field.placeholder}
            disabled
            className="bg-gray-50"
            type={field.type}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            disabled
            className="bg-gray-50 min-h-[100px]"
          />
        );
      
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${field.id}-${index}`} disabled />
                <Label htmlFor={`${field.id}-${index}`} className="text-gray-600">
                  {option}
                </Label>
              </div>
            )) || (
              <div className="flex items-center space-x-2">
                <Checkbox id={field.id} disabled />
                <Label htmlFor={field.id} className="text-gray-600">
                  {field.label}
                </Label>
              </div>
            )}
          </div>
        );
      
      case 'radio':
        return (
          <RadioGroup disabled>
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} disabled />
                <Label htmlFor={`${field.id}-${index}`} className="text-gray-600">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'date':
        return (
          <Input
            type="date"
            disabled
            className="bg-gray-50"
          />
        );
      
      case 'signature':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
            <i className="fas fa-signature text-2xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-500">Signature will be captured here</p>
          </div>
        );
      
      default:
        return <div>Unknown field type</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative border rounded-lg p-4 bg-white transition-all duration-200
        ${isSelected ? 'border-docusign-blue ring-2 ring-docusign-blue ring-opacity-20' : 'border-gray-200 hover:border-gray-300'}
        ${isDragging ? 'shadow-lg' : 'hover:shadow-sm'}
      `}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <div className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
          <i className="fas fa-grip-vertical text-xs text-gray-400"></i>
        </div>
      </div>

      {/* Field Actions */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
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

      {/* Field Content */}
      <div className="space-y-3 mt-2">
        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium text-docusign-charcoal">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded uppercase font-medium">
            {field.type}
          </span>
        </div>
        
        {renderField()}
        
        {/* Field Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {field.required && (
              <span className="flex items-center">
                <i className="fas fa-asterisk text-red-500 mr-1"></i>
                Required
              </span>
            )}
            {field.validation?.minLength && (
              <span>Min: {field.validation.minLength}</span>
            )}
            {field.validation?.maxLength && (
              <span>Max: {field.validation.maxLength}</span>
            )}
          </div>
          <span>ID: {field.id}</span>
        </div>
      </div>
    </div>
  );
}