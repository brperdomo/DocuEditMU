import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DocumentEditor from "@/pages/document-editor";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@shared/schema";

function HomeRedirect() {
  const [, navigate] = useLocation();
  
  const { data: sampleDocument, isLoading } = useQuery<Document>({
    queryKey: ['/api/documents'],
  });

  useEffect(() => {
    if (sampleDocument && !isLoading) {
      navigate(`/documents/${sampleDocument.id}`);
    }
  }, [sampleDocument, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-docusign-light-grey flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-docusign-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-docusign-charcoal">Loading document...</p>
        </div>
      </div>
    );
  }

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeRedirect} />
      <Route path="/documents/:documentId" component={DocumentEditor} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
