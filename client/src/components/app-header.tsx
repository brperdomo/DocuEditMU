import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const [location] = useLocation();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-docusign-blue rounded flex items-center justify-center">
              <i className="fas fa-file-signature text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold text-docusign-charcoal">DocuSign</span>
          </div>
        </Link>
        
        <nav className="flex items-center space-x-1">
          <Link href="/">
            <div>
              <Button
                variant={location === "/" ? "default" : "ghost"}
                size="sm"
                className="text-sm"
              >
                <i className="fas fa-file-alt mr-2"></i>
                Documents
              </Button>
            </div>
          </Link>
          <Link href="/pdf-editor">
            <div>
              <Button
                variant={location === "/pdf-editor" ? "default" : "ghost"}
                size="sm"
                className="text-sm"
              >
                <i className="fas fa-edit mr-2"></i>
                PDF Editor
              </Button>
            </div>
          </Link>
          <Link href="/form-builder">
            <div>
              <Button
                variant={location === "/form-builder" ? "default" : "ghost"}
                size="sm"
                className="text-sm"
              >
                <i className="fas fa-plus mr-2"></i>
                Form Builder
              </Button>
            </div>
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <i className="fas fa-bell mr-2"></i>
          Notifications
        </Button>
        <Button variant="ghost" size="sm">
          <i className="fas fa-user-circle mr-2"></i>
          Account
        </Button>
        <Button className="bg-docusign-blue text-white hover:bg-blue-700">
          <i className="fas fa-plus mr-2"></i>
          New Document
        </Button>
      </div>
    </header>
  );
}