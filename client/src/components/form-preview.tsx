import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField } from "@/pages/form-builder";

interface FormPreviewProps {
  fields: FormField[];
  title: string;
  onBack: () => void;
}

export default function FormPreview({ fields, title, onBack }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const value = formData[field.id];

      // Required validation
      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field.id] = `${field.label} is required`;
        return;
      }

      // Length validation for text fields
      if (value && typeof value === 'string' && field.validation) {
        if (field.validation.minLength && value.length < field.validation.minLength) {
          newErrors[field.id] = `${field.label} must be at least ${field.validation.minLength} characters`;
        }
        if (field.validation.maxLength && value.length > field.validation.maxLength) {
          newErrors[field.id] = `${field.label} must not exceed ${field.validation.maxLength} characters`;
        }
      }

      // Email validation
      if (field.type === 'email' && value && typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.id] = 'Please enter a valid email address';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      alert('Form submitted successfully!\n\nData:\n' + JSON.stringify(formData, null, 2));
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => updateFormData(field.id, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => updateFormData(field.id, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => updateFormData(field.id, val)}>
              <SelectTrigger className={error ? 'border-red-500' : ''}>
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
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options ? field.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${index}`}
                    checked={(value || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const currentValue = value || [];
                      if (checked) {
                        updateFormData(field.id, [...currentValue, option]);
                      } else {
                        updateFormData(field.id, currentValue.filter((v: string) => v !== option));
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                </div>
              )) : (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={!!value}
                    onCheckedChange={(checked) => updateFormData(field.id, checked)}
                  />
                  <Label htmlFor={field.id}>{field.label}</Label>
                </div>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(val) => updateFormData(field.id, val)}
            >
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                  <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => updateFormData(field.id, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'signature':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              value ? 'border-green-300 bg-green-50' : error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
            }`}>
              {value ? (
                <div className="space-y-2">
                  <i className="fas fa-check-circle text-2xl text-green-600"></i>
                  <p className="text-sm text-green-700 font-medium">Signature captured</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFormData(field.id, '')}
                  >
                    Clear Signature
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <i className="fas fa-signature text-2xl text-gray-400"></i>
                  <p className="text-sm text-gray-500">Click to add your signature</p>
                  <Button
                    variant="outline"
                    onClick={() => updateFormData(field.id, `Signature_${Date.now()}`)}
                  >
                    Add Signature
                  </Button>
                </div>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-docusign-light-grey p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-docusign-charcoal">{title}</h1>
              <p className="text-sm text-gray-600 mt-1">Form Preview</p>
            </div>
            <Button variant="outline" onClick={onBack}>
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Editor
            </Button>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map(renderField)}

              <div className="flex items-center justify-between pt-6 border-t">
                <div className="text-sm text-gray-500">
                  {fields.length} field{fields.length !== 1 ? 's' : ''}
                </div>
                <Button
                  type="submit"
                  className="bg-docusign-blue text-white hover:bg-blue-700"
                >
                  Submit Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}