import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppHeader() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-docusign-medium-grey h-16 flex items-center px-6 justify-between">
      {/* Left side - Logo and Navigation */}
      <div className="flex items-center space-x-8">
        {/* DocuSign-style Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-docusign-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-semibold text-docusign-charcoal">DocuSign</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          <Link href="/">
            <a className="text-sm font-medium text-docusign-charcoal hover:text-docusign-blue transition-colors">
              Documents
            </a>
          </Link>
          <Link href="/form-builder">
            <a className="text-sm font-medium text-docusign-charcoal hover:text-docusign-blue transition-colors">
              Form Builder
            </a>
          </Link>
        </nav>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-docusign-blue focus:border-transparent text-sm"
            onFocus={(e) => {
              e.target.select();
            }}
          />
        </div>
      </div>

      {/* Right side - User Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 text-gray-600 hover:text-docusign-blue hover:bg-docusign-light-grey"
        >
          <i className="fas fa-bell text-base"></i>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </Button>

        {/* Help */}
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-gray-600 hover:text-docusign-blue hover:bg-docusign-light-grey"
          title="Help & Support"
        >
          <i className="fas fa-question-circle text-base"></i>
        </Button>

        {/* User Menu */}
        <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-docusign-blue hover:bg-docusign-light-grey"
            >
              <div className="w-8 h-8 bg-docusign-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                DU
              </div>
              <span className="text-sm font-medium text-docusign-charcoal">Demo User</span>
              <i className="fas fa-chevron-down text-xs"></i>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <i className="fas fa-user mr-2 text-sm"></i>
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fas fa-cog mr-2 text-sm"></i>
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fas fa-credit-card mr-2 text-sm"></i>
                <span>Billing & Usage</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <i className="fas fa-question-circle mr-2 text-sm"></i>
              <span>Help Center</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <i className="fas fa-book mr-2 text-sm"></i>
              <span>API Documentation</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <i className="fas fa-sign-out-alt mr-2 text-sm"></i>
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}