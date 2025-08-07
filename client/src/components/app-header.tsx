import { Button } from "@/components/ui/button";

export default function AppHeader() {
  return (
    <header className="bg-white border-b border-docusign-medium-grey h-14 flex items-center justify-between px-6 relative z-50 shadow-sm">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-3">
          {/* DocuSign Logo with updated 2024 branding */}
          <div className="flex items-center">
            <div className="w-7 h-7 bg-docusign-blue rounded flex items-center justify-center mr-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="font-bold">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-docusign-charcoal tracking-tight">DocuSign</span>
          </div>
        </div>
        
        {/* Updated navigation to match DocuSign 2024 refresh */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium text-docusign-charcoal hover:text-docusign-blue transition-colors">
            Home
          </a>
          <a href="#" className="text-sm font-medium text-docusign-blue border-b-2 border-docusign-blue pb-2">
            Agreements
          </a>
          <a href="#" className="text-sm font-medium text-docusign-charcoal hover:text-docusign-blue transition-colors">
            Templates
          </a>
          <a href="#" className="text-sm font-medium text-docusign-charcoal hover:text-docusign-blue transition-colors">
            Reports
          </a>
          <a href="#" className="text-sm font-medium text-docusign-charcoal hover:text-docusign-blue transition-colors">
            Admin
          </a>
        </nav>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Updated "Start" button with DocuSign 2024 styling */}
        <Button className="bg-docusign-blue text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm">
          <i className="fas fa-plus mr-2 text-xs"></i>
          Start
        </Button>
        
        {/* Notifications */}
        <button className="p-2 text-docusign-charcoal hover:text-docusign-blue hover:bg-docusign-surface rounded-md transition-colors">
          <i className="fas fa-bell text-sm"></i>
        </button>
        
        {/* Help */}
        <button className="p-2 text-docusign-charcoal hover:text-docusign-blue hover:bg-docusign-surface rounded-md transition-colors">
          <i className="fas fa-question-circle text-sm"></i>
        </button>
        
        {/* Profile */}
        <div className="w-8 h-8 bg-docusign-medium-grey rounded-full flex items-center justify-center hover:bg-docusign-light-grey cursor-pointer transition-colors">
          <i className="fas fa-user text-docusign-charcoal text-xs"></i>
        </div>
      </div>
    </header>
  );
}
