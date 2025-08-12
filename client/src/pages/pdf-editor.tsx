import { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, KeyboardSensor, DragStartEvent } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PDFFieldPalette from "@/components/pdf-field-palette";
import DraggableField from "@/components/draggable-field";
import AppHeader from "@/components/app-header";

// Visual Document Component that looks like the Documents tab
function DocumentViewer({ document, pages }: { document: any; pages: any[] }) {
  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden" style={{ width: '612px', minHeight: '792px' }}>
      {/* Document Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900">{document?.title || 'Service Agreement'}</h1>
        <p className="text-sm text-gray-600 mt-1">Document ready for field placement</p>
      </div>

      {/* Document Content */}
      <div className="p-8 leading-relaxed" style={{ fontFamily: 'Times, serif' }}>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">SERVICE AGREEMENT</h2>
          </div>

          <div className="space-y-4">
            <p>
              This Service Agreement ("Agreement") is entered into on{" "}
              <span className="inline-block w-32 border-b border-gray-400 mx-1 h-5"></span>{" "}
              between{" "}
              <span className="inline-block w-64 border-b border-gray-400 mx-1 h-5"></span>{" "}
              ("Client") and{" "}
              <span className="inline-block w-64 border-b border-gray-400 mx-1 h-5"></span>{" "}
              ("Service Provider").
            </p>

            <div className="mt-8">
              <h3 className="font-bold text-lg mb-4">SERVICES TO BE PROVIDED:</h3>
              <p>The Service Provider agrees to provide the following services:</p>
              <div className="mt-2 space-y-2">
                <div className="w-full border-b border-gray-400 h-5"></div>
                <div className="w-full border-b border-gray-400 h-5"></div>
                <div className="w-full border-b border-gray-400 h-5"></div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-lg mb-4">PAYMENT TERMS:</h3>
              <div className="space-y-3">
                <p>
                  Total Contract Value: $
                  <span className="inline-block w-32 border-b border-gray-400 mx-1 h-5"></span>
                </p>
                <p>
                  Payment Schedule:{" "}
                  <span className="inline-block w-96 border-b border-gray-400 mx-1 h-5"></span>
                </p>
                <p>
                  Payment Method:{" "}
                  <span className="inline-block w-96 border-b border-gray-400 mx-1 h-5"></span>
                </p>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="font-bold text-lg mb-6">SIGNATURES:</h3>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="flex justify-between items-end">
                  <div className="flex-1 mr-8">
                    <p className="mb-2">Client Name: <span className="inline-block w-64 border-b border-gray-400 mx-1 h-5"></span></p>
                    <p>Client Signature: <span className="inline-block w-80 border-b border-gray-400 mx-1 h-5"></span></p>
                  </div>
                  <div>
                    <p>Date: <span className="inline-block w-32 border-b border-gray-400 mx-1 h-5"></span></p>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-8">
                  <div className="flex-1 mr-8">
                    <p className="mb-2">Service Provider Name: <span className="inline-block w-64 border-b border-gray-400 mx-1 h-5"></span></p>
                    <p>Service Provider Signature: <span className="inline-block w-80 border-b border-gray-400 mx-1 h-5"></span></p>
                  </div>
                  <div>
                    <p>Date: <span className="inline-block w-32 border-b border-gray-400 mx-1 h-5"></span></p>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-8">
                  <div className="flex-1 mr-8">
                    <p className="mb-2">Witness Name: <span className="inline-block w-64 border-b border-gray-400 mx-1 h-5"></span></p>
                    <p>Witness Signature: <span className="inline-block w-80 border-b border-gray-400 mx-1 h-5"></span></p>
                  </div>
                  <div>
                    <p>Date: <span className="inline-block w-32 border-b border-gray-400 mx-1 h-5"></span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface PDFField {
  id: string;
  type: 'signature' | 'date' | 'text' | 'checkbox' | 'initial' | 'name' | 'email' | 'title';
  label: string;
  x: number; // Position on page (percentage)
  y: number; // Position on page (percentage)
  width: number; // Width (percentage)
  height: number; // Height (percentage)
  page: number;
  required: boolean;
  assignee?: 'signer1' | 'signer2' | 'sender';
  placeholder?: string;
  fontSize?: number;
  value?: string;
}

export default function PDFEditor() {
  const [fields, setFields] = useState<PDFField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [draggedField, setDraggedField] = useState<PDFField | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  
  const pageRef = useRef<HTMLDivElement>(null);

  // Load the service agreement document from the existing Documents tab
  const { data: document, isLoading: isLoadingDoc } = useQuery({
    queryKey: ['/api/documents'],
  });

  const { data: pages, isLoading: isLoadingPages } = useQuery({
    queryKey: ['/api/documents', document?.id, 'pages'],
    enabled: !!document?.id,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const clearAllFields = () => {
    setFields([]);
    setSelectedFieldId(null);
  };

  const addField = useCallback((fieldType: PDFField['type']) => {
    const newField: PDFField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      x: 25, // Default position (25% from left)
      y: 25, // Default position (25% from top)
      width: fieldType === 'signature' ? 30 : fieldType === 'checkbox' ? 3 : 20,
      height: fieldType === 'signature' ? 8 : fieldType === 'checkbox' ? 3 : 5,
      page: 1, // Single page document
      required: fieldType === 'signature' || fieldType === 'date',
      assignee: 'signer1',
      placeholder: getFieldPlaceholder(fieldType),
      fontSize: 12
    };
    
    setFields(prev => [...prev, newField]);
    setSelectedFieldId(newField.id);
  }, []);

  const getFieldPlaceholder = (type: PDFField['type']): string => {
    const placeholders: Record<PDFField['type'], string> = {
      signature: 'Your signature',
      date: 'MM/DD/YYYY',
      text: 'Enter text',
      checkbox: '',
      initial: 'Initials',
      name: 'Full name',
      email: 'email@example.com',
      title: 'Job title'
    };
    return placeholders[type];
  };

  const updateField = (fieldId: string, updates: Partial<PDFField>) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const field = fields.find(f => f.id === active.id);
    if (field) {
      setDraggedField(field);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    
    if (!pageRef.current) return;

    const field = fields.find(f => f.id === active.id);
    if (!field) return;

    const pageRect = pageRef.current.getBoundingClientRect();
    
    // Convert pixel delta to percentage
    const xPercentage = (delta.x / pageRect.width) * 100;
    const yPercentage = (delta.y / pageRect.height) * 100;
    
    const newX = Math.max(0, Math.min(95, field.x + xPercentage));
    const newY = Math.max(0, Math.min(95, field.y + yPercentage));
    
    updateField(field.id, { x: newX, y: newY });
    setDraggedField(null);
  };

  const exportFieldConfiguration = async () => {
    if (!document) return;
    
    const fieldsData = {
      documentTitle: document.title,
      fields: fields
    };
    
    const dataStr = JSON.stringify(fieldsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${document.title.replace(/[^a-z0-9]/gi, '_')}-fields.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  if (isLoadingDoc || isLoadingPages) {
    return (
      <div className="min-h-screen bg-docusign-light-grey flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-docusign-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Service Agreement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-docusign-light-grey">
      <AppHeader />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Field Palette */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-docusign-charcoal mb-2">Document Field Editor</h2>
            <p className="text-sm text-gray-600">Add interactive fields to your Service Agreement</p>
          </div>
          
          {/* Document Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-3">
              <div className="text-sm text-gray-600 flex items-center">
                <i className="fas fa-file-contract mr-2 text-docusign-blue"></i>
                {document?.title || 'Service Agreement'}
              </div>
              
              <Button
                onClick={clearAllFields}
                size="sm"
                variant="outline"
                className="w-full"
              >
                <i className="fas fa-refresh mr-1"></i>
                Clear All Fields
              </Button>
            </div>
          </div>
          
          <PDFFieldPalette onAddField={addField} />
          
          {/* Export */}
          {fields.length > 0 && (
            <div className="p-6 border-t border-gray-200 mt-auto">
              <Button
                onClick={exportFieldConfiguration}
                className="w-full bg-docusign-blue text-white hover:bg-blue-700"
              >
                Export Field Configuration
              </Button>
            </div>
          )}
        </div>

        {/* Center - Document Viewer */}
        <div className="flex-1 flex flex-col">
          {/* Document Toolbar */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="font-medium text-gray-900">Visual Document Editor</h3>
              <span className="text-sm text-gray-500">
                {fields.length} field{fields.length !== 1 ? 's' : ''} placed
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(Math.max(0.5, scale - 0.1))}
              >
                <i className="fas fa-search-minus"></i>
              </Button>
              <span className="text-sm min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(Math.min(2.0, scale + 0.1))}
              >
                <i className="fas fa-search-plus"></i>
              </Button>
            </div>
          </div>

          {/* Document Content Area */}
          <div className="flex-1 overflow-auto bg-gray-100 p-8">
            <div className="flex justify-center">
              <DndContext
                sensors={sensors}
                modifiers={[restrictToParentElement]}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div
                  ref={pageRef}
                  className="relative"
                  style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
                >
                  <DocumentViewer document={document} pages={pages} />
                  
                  {/* Field Overlays */}
                  {fields.map((field) => (
                    <DraggableField
                      key={field.id}
                      field={field}
                      isSelected={field.id === selectedFieldId}
                      onClick={() => setSelectedFieldId(field.id)}
                      containerRef={pageRef}
                    />
                  ))}
                </div>

                <DragOverlay>
                  {draggedField ? (
                    <div className="opacity-90">
                      <DraggableField
                        field={draggedField}
                        isSelected={false}
                        onClick={() => {}}
                        containerRef={pageRef}
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        {selectedField && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-docusign-charcoal mb-2">Field Properties</h3>
              <p className="text-sm text-gray-600">{selectedField.type.charAt(0).toUpperCase() + selectedField.type.slice(1)} Field</p>
            </div>
            
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Field Label */}
              <div>
                <Label htmlFor="field-label">Field Label</Label>
                <Input
                  id="field-label"
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Position */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="field-x">X Position (%)</Label>
                  <Input
                    id="field-x"
                    type="number"
                    min="0"
                    max="95"
                    step="0.1"
                    value={selectedField.x}
                    onChange={(e) => updateField(selectedField.id, { x: parseFloat(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="field-y">Y Position (%)</Label>
                  <Input
                    id="field-y"
                    type="number"
                    min="0"
                    max="95"
                    step="0.1"
                    value={selectedField.y}
                    onChange={(e) => updateField(selectedField.id, { y: parseFloat(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="field-width">Width (%)</Label>
                  <Input
                    id="field-width"
                    type="number"
                    min="1"
                    max="95"
                    step="0.1"
                    value={selectedField.width}
                    onChange={(e) => updateField(selectedField.id, { width: parseFloat(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="field-height">Height (%)</Label>
                  <Input
                    id="field-height"
                    type="number"
                    min="1"
                    max="95"
                    step="0.1"
                    value={selectedField.height}
                    onChange={(e) => updateField(selectedField.id, { height: parseFloat(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Assignee */}
              <div>
                <Label htmlFor="field-assignee">Assignee</Label>
                <Select
                  value={selectedField.assignee || 'signer1'}
                  onValueChange={(value) => updateField(selectedField.id, { assignee: value as 'signer1' | 'signer2' | 'sender' })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="signer1">Client (Signer 1)</SelectItem>
                    <SelectItem value="signer2">Service Provider (Signer 2)</SelectItem>
                    <SelectItem value="sender">Sender/Witness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Required */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="field-required"
                  checked={selectedField.required}
                  onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="field-required">Required field</Label>
              </div>

              {/* Placeholder */}
              {selectedField.type !== 'checkbox' && (
                <div>
                  <Label htmlFor="field-placeholder">Placeholder Text</Label>
                  <Input
                    id="field-placeholder"
                    value={selectedField.placeholder || ''}
                    onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                    className="mt-1"
                  />
                </div>
              )}

              {/* Delete Field */}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  onClick={() => deleteField(selectedField.id)}
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Delete Field
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}