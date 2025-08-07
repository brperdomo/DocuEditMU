import { Button } from "@/components/ui/button";

export default function AppHeader() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 relative z-50">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-docusign-blue rounded-md flex items-center justify-center">
            <i className="fas fa-file-signature text-white text-sm"></i>
          </div>
          <span className="text-xl font-semibold text-docusign-charcoal">DocuSign</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-docusign-charcoal hover:text-docusign-blue transition-colors font-medium">
            Home
          </a>
          <a href="#" className="text-docusign-blue font-medium border-b-2 border-docusign-blue pb-1">
            Agreements
          </a>
          <a href="#" className="text-docusign-charcoal hover:text-docusign-blue transition-colors font-medium">
            Templates
          </a>
          <a href="#" className="text-docusign-charcoal hover:text-docusign-blue transition-colors font-medium">
            Reports
          </a>
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button className="bg-docusign-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <i className="fas fa-plus mr-2"></i>
          Start
        </Button>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <i className="fas fa-user text-gray-600 text-sm"></i>
        </div>
      </div>
    </header>
  );
}
