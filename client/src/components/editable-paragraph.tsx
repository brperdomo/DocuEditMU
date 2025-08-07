import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Paragraph } from "@shared/schema";

interface EditableParagraphProps {
  paragraph: Paragraph;
  documentId: string;
  onSelect: () => void;
  isSelected: boolean;
  isRecentlyPasted?: boolean;
}

export default function EditableParagraph({
  paragraph,
  documentId,
  onSelect,
  isSelected,
  isRecentlyPasted
}: EditableParagraphProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(paragraph.content);
  const queryClient = useQueryClient();

  const updateParagraphMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      const response = await apiRequest('PATCH', `/api/paragraphs/${paragraph.id}`, {
        content
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents', documentId, 'pages'] });
      setIsEditing(false);
    }
  });

  const handleStartEdit = () => {
    setIsEditing(true);
    onSelect();
  };

  const handleSaveEdit = () => {
    updateParagraphMutation.mutate({ content: editContent });
  };

  const handleCancelEdit = () => {
    setEditContent(paragraph.content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="relative group editing-overlay rounded p-2">
        <div className="absolute -left-4 top-0">
          <button className="w-3 h-3 bg-docusign-yellow rounded-full animate-pulse" title="Currently editing"></button>
        </div>
        <div className="bg-white p-4 rounded border-2 border-docusign-blue">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-32 resize-none border-none outline-none text-gray-800 leading-relaxed"
          />
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <i className="fas fa-edit text-docusign-blue"></i>
              <span>Editing paragraph {paragraph.orderIndex + 1}</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                className="bg-docusign-blue text-white hover:bg-blue-700"
                onClick={handleSaveEdit}
                disabled={updateParagraphMutation.isPending}
              >
                {updateParagraphMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const containerClass = isRecentlyPasted
    ? "relative group bg-green-50 border-l-4 border-docusign-success p-4 rounded"
    : "relative group";

  return (
    <div className={containerClass}>
      <div className="absolute -left-4 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="w-3 h-3 bg-docusign-blue rounded-full"
          title="Edit paragraph"
          onClick={handleStartEdit}
        ></button>
      </div>
      
      {isRecentlyPasted && (
        <div className="absolute -left-6 top-0">
          <div className="w-4 h-4 bg-docusign-success rounded-full flex items-center justify-center">
            <i className="fas fa-check text-white text-xs"></i>
          </div>
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div 
          className={`flex-1 text-gray-800 leading-relaxed cursor-text p-2 rounded transition-colors ${
            isSelected ? 'bg-blue-50' : 'hover:bg-blue-50'
          }`}
          onClick={onSelect}
          dangerouslySetInnerHTML={{ __html: paragraph.content }}
        />
        {isRecentlyPasted && (
          <div className="ml-4 text-xs text-docusign-success font-medium">
            <i className="fas fa-paste mr-1"></i>Recently pasted
          </div>
        )}
      </div>
    </div>
  );
}
