import { useState } from "react";
import { DndContext, closestCenter, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
// Note: arrayMove functionality will be implemented inline
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import FormFieldItem from "@/components/form-field-item";
import FormFieldPalette from "@/components/form-field-palette";
import FormPreview from "@/components/form-preview";

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'signature';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [previewMode, setPreviewMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedField = fields.find(f => f.id === selectedFieldId);

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: type === 'textarea' ? 'Enter your text here...' : `Enter ${type}...`,
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined
    };
    
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const duplicateField = (id: string) => {
    const fieldToCopy = fields.find(f => f.id === id);
    if (!fieldToCopy) return;
    
    const newField: FormField = {
      ...fieldToCopy,
      id: `field_${Date.now()}`,
      label: `${fieldToCopy.label} (Copy)`
    };
    
    const fieldIndex = fields.findIndex(f => f.id === id);
    const newFields = [...fields];
    newFields.splice(fieldIndex + 1, 0, newField);
    setFields(newFields);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        
        // Inline arrayMove implementation
        const result = [...items];
        const [removed] = result.splice(oldIndex, 1);
        result.splice(newIndex, 0, removed);
        return result;
      });
    }
  };

  const handleExportForm = () => {
    const formData = {
      title: formTitle,
      fields: fields,
      createdAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${formTitle.toLowerCase().replace(/\s+/g, '-')}-form.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (previewMode) {
    return <FormPreview 
      fields={fields} 
      title={formTitle} 
      onBack={() => setPreviewMode(false)} 
    />;
  }

  return (
    <div className="h-screen bg-docusign-light-grey flex">
      {/* Left Sidebar - Field Palette */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-docusign-charcoal mb-2">Form Builder</h2>
          <p className="text-sm text-gray-600">Drag fields to create your form</p>
        </div>
        
        <FormFieldPalette onAddField={addField} />
        
        {/* Form Settings */}
        <div className="p-6 border-t border-gray-200 mt-auto">
          <div className="space-y-4">
            <div>
              <Label htmlFor="form-title">Form Title</Label>
              <Input
                id="form-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleExportForm}
              variant="outline"
              className="w-full"
              disabled={fields.length === 0}
            >
              Export Form
            </Button>
          </div>
        </div>
      </div>

      {/* Center - Form Builder Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-medium text-docusign-charcoal">{formTitle}</h1>
            <span className="text-sm text-gray-500">
              {fields.length} field{fields.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(true)}
              disabled={fields.length === 0}
            >
              Preview
            </Button>
            <Button
              onClick={handleExportForm}
              disabled={fields.length === 0}
              className="bg-docusign-blue text-white hover:bg-blue-700"
            >
              Save Form
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">{formTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                {fields.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-plus text-2xl text-gray-400"></i>
                    </div>
                    <p className="text-lg font-medium mb-2">No fields yet</p>
                    <p className="text-sm">Drag a field from the left panel to get started</p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {fields.map((field) => (
                          <FormFieldItem
                            key={field.id}
                            field={field}
                            isSelected={selectedFieldId === field.id}
                            onSelect={() => setSelectedFieldId(field.id)}
                            onUpdate={(updates: Partial<FormField>) => updateField(field.id, updates)}
                            onDelete={() => deleteField(field.id)}
                            onDuplicate={() => duplicateField(field.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Field Properties */}
      {selectedField && (
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-docusign-charcoal mb-2">Field Properties</h3>
            <p className="text-sm text-gray-600">Configure the selected field</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="field-label">Label</Label>
              <Input
                id="field-label"
                value={selectedField.label}
                onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={selectedField.placeholder || ''}
                onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="field-required"
                checked={selectedField.required}
                onCheckedChange={(checked) => updateField(selectedField.id, { required: !!checked })}
              />
              <Label htmlFor="field-required">Required field</Label>
            </div>

            {(selectedField.type === 'select' || selectedField.type === 'radio') && (
              <div>
                <Label>Options</Label>
                <div className="mt-2 space-y-2">
                  {selectedField.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(selectedField.options || [])];
                          newOptions[index] = e.target.value;
                          updateField(selectedField.id, { options: newOptions });
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newOptions = selectedField.options?.filter((_, i) => i !== index);
                          updateField(selectedField.id, { options: newOptions });
                        }}
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                      updateField(selectedField.id, { options: newOptions });
                    }}
                  >
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            {(selectedField.type === 'text' || selectedField.type === 'textarea') && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Validation</h4>
                <div>
                  <Label htmlFor="min-length">Min Length</Label>
                  <Input
                    id="min-length"
                    type="number"
                    value={selectedField.validation?.minLength || ''}
                    onChange={(e) => updateField(selectedField.id, { 
                      validation: { 
                        ...selectedField.validation, 
                        minLength: e.target.value ? parseInt(e.target.value) : undefined 
                      }
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="max-length">Max Length</Label>
                  <Input
                    id="max-length"
                    type="number"
                    value={selectedField.validation?.maxLength || ''}
                    onChange={(e) => updateField(selectedField.id, { 
                      validation: { 
                        ...selectedField.validation, 
                        maxLength: e.target.value ? parseInt(e.target.value) : undefined 
                      }
                    })}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}