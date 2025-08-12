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
    <aside className="w-64 bg-docusign-surface border-r border-docusign-medium-grey flex flex-col">
      <div className="p-4 border-b border-docusign-medium-grey">
        <h2 className="text-base font-semibold text-docusign-charcoal mb-3">Document</h2>
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
      
      <div className="p-4 border-b border-docusign-medium-grey">
        <h3 className="text-sm font-semibold text-docusign-charcoal mb-3 uppercase tracking-wide">Pages</h3>
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
          className="w-full mt-3 p-2 border-2 border-dashed border-docusign-medium-grey rounded text-docusign-charcoal hover:border-docusign-blue hover:text-docusign-blue transition-colors text-sm"
          onClick={handleAddNewPage}
          disabled={addPageMutation.isPending}
        >
          <i className="fas fa-plus mr-2"></i>
          {addPageMutation.isPending ? 'Adding...' : 'Add Page'}
        </Button>
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-semibold text-docusign-charcoal mb-3 uppercase tracking-wide">Actions</h3>
        <div className="space-y-1">
          <button 
            className="w-full text-left p-2 text-sm text-docusign-charcoal hover:bg-docusign-light-grey rounded transition-colors"
            onClick={() => {
              const selection = window.getSelection()?.toString();
              if (selection) {
                navigator.clipboard.writeText(selection);
              }
            }}
          >
            <i className="fas fa-copy mr-3 text-xs"></i>Copy Text
          </button>
          <button 
            className="w-full text-left p-2 text-sm text-docusign-charcoal hover:bg-docusign-light-grey rounded transition-colors"
            onClick={async () => {
              try {
                const copiedText = await navigator.clipboard.readText();
                const copiedParagraph = localStorage.getItem('copiedParagraph');
                if (copiedParagraph) {
                  const parsed = JSON.parse(copiedParagraph);
                  // Could implement paragraph pasting here
                  alert(`Pasted: ${parsed.content.slice(0, 50)}...`);
                }
              } catch (err) {
                console.log('Clipboard access denied');
              }
            }}
          >
            <i className="fas fa-paste mr-3 text-xs"></i>Paste
          </button>
          <button 
            className="w-full text-left p-2 text-sm text-docusign-charcoal hover:bg-docusign-light-grey rounded transition-colors"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              }
            }}
          >
            <i className="fas fa-undo mr-3 text-xs"></i>Undo
          </button>
          <button 
            className="w-full text-left p-2 text-sm text-docusign-charcoal hover:bg-docusign-light-grey rounded transition-colors"
            onClick={() => {
              window.history.forward();
            }}
          >
            <i className="fas fa-redo mr-3 text-xs"></i>Redo
          </button>
        </div>
      </div>
    </aside>
  );
}
