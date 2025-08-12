import { useState, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, KeyboardSensor, DragStartEvent } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PDFFieldPalette from "@/components/pdf-field-palette";
import PDFFieldOverlay from "@/components/pdf-field-overlay";
import DraggableField from "@/components/draggable-field";
import AppHeader from "@/components/app-header";

// Configure PDF.js worker with empty string to disable worker functionality
// This allows basic PDF rendering without requiring external worker files
pdfjs.GlobalWorkerOptions.workerSrc = '';

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
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [fields, setFields] = useState<PDFField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [draggedField, setDraggedField] = useState<PDFField | null>(null);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  
  const pageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setFields([]); // Clear existing fields when new PDF is loaded
    }
  };

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const handlePageLoadSuccess = (page: any) => {
    const viewport = page.getViewport({ scale });
    setPageSize({
      width: viewport.width,
      height: viewport.height
    });
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
      page: currentPage,
      required: fieldType === 'signature' || fieldType === 'date',
      assignee: 'signer1',
      placeholder: getFieldPlaceholder(fieldType),
      fontSize: 12
    };
    
    setFields(prev => [...prev, newField]);
    setSelectedFieldId(newField.id);
  }, [currentPage]);

  const getFieldPlaceholder = (type: PDFField['type']): string => {
    switch (type) {
      case 'signature': return 'Sign here';
      case 'date': return 'Date';
      case 'text': return 'Enter text';
      case 'name': return 'Full name';
      case 'email': return 'Email address';
      case 'title': return 'Job title';
      case 'initial': return 'Initial';
      default: return 'Field';
    }
  };

  const updateField = (id: string, updates: Partial<PDFField>) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(field => field.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const field = fields.find(f => f.id === event.active.id);
    if (field) {
      setDraggedField(field);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    
    if (!pageRef.current || !pageSize.width || !pageSize.height) return;

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

  const exportPDFWithFields = async () => {
    if (!pdfFile) return;
    
    const fieldsData = {
      filename: pdfFile.name,
      totalPages: numPages,
      fields: fields,
      createdAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(fieldsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${pdfFile.name.replace('.pdf', '')}-fields.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);
  const currentPageFields = fields.filter(f => f.page === currentPage);

  return (
    <div className="min-h-screen bg-docusign-light-grey">
      <AppHeader />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Field Palette */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-docusign-charcoal mb-2">PDF Field Editor</h2>
            <p className="text-sm text-gray-600">Upload a PDF and add interactive fields</p>
          </div>
          
          {/* PDF Upload */}
          <div className="p-6 border-b border-gray-200">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              variant={pdfFile ? "outline" : "default"}
            >
              <i className="fas fa-upload mr-2"></i>
              {pdfFile ? 'Change PDF' : 'Upload PDF'}
            </Button>
            {pdfFile && (
              <div className="mt-2 text-sm text-gray-600">
                <i className="fas fa-file-pdf mr-2 text-red-500"></i>
                {pdfFile.name}
              </div>
            )}
          </div>
          
          {pdfFile && <PDFFieldPalette onAddField={addField} />}
          
          {/* Export */}
          {fields.length > 0 && (
            <div className="p-6 border-t border-gray-200 mt-auto">
              <Button
                onClick={exportPDFWithFields}
                className="w-full bg-docusign-blue text-white hover:bg-blue-700"
              >
                Export Field Configuration
              </Button>
            </div>
          )}
        </div>

        {/* Center - PDF Viewer */}
        <div className="flex-1 flex flex-col">
          {/* PDF Toolbar */}
          {pdfFile && (
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {numPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                  disabled={currentPage >= numPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </Button>
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

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {fields.length} field{fields.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* PDF Canvas */}
          <div className="flex-1 overflow-auto p-6 flex justify-center">
            {pdfFile ? (
              <div className="relative">
                <DndContext
                  sensors={sensors}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToParentElement]}
                >
                  <div 
                    ref={pageRef}
                    className="relative bg-white shadow-lg border border-gray-200"
                    style={{ display: 'inline-block' }}
                  >
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={handleDocumentLoadSuccess}
                      className="relative"
                    >
                      <Page 
                        pageNumber={currentPage} 
                        scale={scale}
                        onLoadSuccess={handlePageLoadSuccess}
                      />
                    </Document>
                    
                    {/* Field Overlays */}
                    {currentPageFields.map(field => (
                      <DraggableField
                        key={field.id}
                        field={field}
                        isSelected={selectedFieldId === field.id}
                        onSelect={() => setSelectedFieldId(field.id)}
                        onUpdate={(updates) => updateField(field.id, updates)}
                        onDelete={() => deleteField(field.id)}
                        pageSize={pageSize}
                        scale={scale}
                      />
                    ))}
                  </div>

                  <DragOverlay>
                    {draggedField ? (
                      <div className="bg-blue-100 border-2 border-blue-400 rounded px-2 py-1 text-sm opacity-75">
                        {draggedField.label}
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-file-pdf text-4xl text-gray-400"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No PDF Loaded</h3>
                  <p className="text-sm">Upload a PDF to start adding fields</p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4"
                  >
                    <i className="fas fa-upload mr-2"></i>
                    Upload PDF
                  </Button>
                </div>
              </div>
            )}
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
                <Label htmlFor="field-assignee">Assignee</Label>
                <Select
                  value={selectedField.assignee}
                  onValueChange={(value) => updateField(selectedField.id, { assignee: value as PDFField['assignee'] })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="signer1">Signer 1</SelectItem>
                    <SelectItem value="signer2">Signer 2</SelectItem>
                    <SelectItem value="sender">Sender</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="field-x">X Position (%)</Label>
                  <Input
                    id="field-x"
                    type="number"
                    min="0"
                    max="100"
                    value={Math.round(selectedField.x)}
                    onChange={(e) => updateField(selectedField.id, { x: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="field-y">Y Position (%)</Label>
                  <Input
                    id="field-y"
                    type="number"
                    min="0"
                    max="100"
                    value={Math.round(selectedField.y)}
                    onChange={(e) => updateField(selectedField.id, { y: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="field-width">Width (%)</Label>
                  <Input
                    id="field-width"
                    type="number"
                    min="1"
                    max="100"
                    value={Math.round(selectedField.width)}
                    onChange={(e) => updateField(selectedField.id, { width: parseInt(e.target.value) || 1 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="field-height">Height (%)</Label>
                  <Input
                    id="field-height"
                    type="number"
                    min="1"
                    max="100"
                    value={Math.round(selectedField.height)}
                    onChange={(e) => updateField(selectedField.id, { height: parseInt(e.target.value) || 1 })}
                    className="mt-1"
                  />
                </div>
              </div>

              {(selectedField.type === 'text' || selectedField.type === 'name' || selectedField.type === 'email') && (
                <div>
                  <Label htmlFor="field-placeholder">Placeholder</Label>
                  <Input
                    id="field-placeholder"
                    value={selectedField.placeholder || ''}
                    onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                    className="mt-1"
                  />
                </div>
              )}

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

              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteField(selectedField.id)}
                  className="w-full"
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