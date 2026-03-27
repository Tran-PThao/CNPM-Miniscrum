import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";

function MainLayoutContent({ children, activePage, header, showHeader = true }) {
  const { isOpen, close, toggle } = useSidebar();

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar - Mobile Drawer / Desktop Fixed */}
      <Sidebar 
        activePage={activePage} 
        isOpen={isOpen} 
        onClose={close} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 w-full transition-all duration-300">
        {showHeader && (header || <TopBar />)}
        
        <main className={`flex-1 p-4 md:p-8 ${!showHeader ? 'pt-4' : ''}`}>
          {children}
        </main>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={close}
        />
      )}
    </div>
  );
}

export default function MainLayout(props) {
  return (
    <SidebarProvider>
      <MainLayoutContent {...props} />
    </SidebarProvider>
  );
}
