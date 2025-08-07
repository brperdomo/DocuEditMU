import { useState } from "react";
import { Button } from "@/components/ui/button";
import PageThumbnail from "./page-thumbnail";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { DocumentPage } from "@shared/schema";

interface SidebarProps {
  documentId: string;
  currentPageNumber: number;
  onPageSelect: (pageNumber: number) => void;
}

export default function Sidebar({ documentId, currentPageNumber, onPageSelect }: SidebarProps) {
  const queryClient = useQueryClient();
  
  const { data: document } = useQuery({
    queryKey: ['/api/documents', documentId],
  });

  const { data: pages = [] } = useQuery<DocumentPage[]>({
    queryKey: ['/api/documents', documentId, 'pages'],
  });

  const addPageMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/documents/${documentId}/pages`, {
        pageNumber: pages.length + 1,
        content: []
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents', documentId, 'pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/documents', documentId] });
    }
  });

  const deletePageMutation = useMutation({
    mutationFn: async (pageId: string) => {
      await apiRequest('DELETE', `/api/documents/${documentId}/pages/${pageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents', documentId, 'pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/documents', documentId] });
    }
  });

  const handleAddNewPage = () => {
    addPageMutation.mutate();
  };

  const handleDeletePage = (page: DocumentPage) => {
    if (pages.length > 1) {
      deletePageMutation.mutate(page.id);
    }
  };

  return (
    <aside className="w-64 sidebar-gradient border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-docusign-charcoal mb-3">Document Editor</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>{document?.filename || 'Document.pdf'}</span>
          </div>
          <div className="flex justify-between">
            <span>Pages:</span>
            <span>{document?.totalPages || pages.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Modified:</span>
            <span>Today, 2:30 PM</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-docusign-charcoal mb-3">Pages</h3>
        <div className="space-y-2">
          {pages.map((page) => (
            <PageThumbnail
              key={page.id}
              pageNumber={page.pageNumber}
              isActive={page.pageNumber === currentPageNumber}
              onSelect={() => onPageSelect(page.pageNumber)}
              onEdit={() => {/* TODO: Implement page editing */}}
              onDelete={() => handleDeletePage(page)}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          className="w-full mt-3 p-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-docusign-blue hover:text-docusign-blue transition-colors text-sm"
          onClick={handleAddNewPage}
          disabled={addPageMutation.isPending}
        >
          <i className="fas fa-plus mr-2"></i>
          {addPageMutation.isPending ? 'Adding...' : 'Add New Page'}
        </Button>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-docusign-charcoal mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <i className="fas fa-copy mr-2"></i>Copy Selected Text
          </button>
          <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <i className="fas fa-paste mr-2"></i>Paste Content
          </button>
          <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <i className="fas fa-undo mr-2"></i>Undo Changes
          </button>
          <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <i className="fas fa-redo mr-2"></i>Redo Changes
          </button>
        </div>
      </div>
    </aside>
  );
}
