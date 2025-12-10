import AdminTopbar from "@/components/side-nav/AdminTopbar";
import AdminSidebarSmall from "@/components/side-nav/AdminSidebarSmall";
import AdminSidebarExpanded from "@/components/side-nav/AdminSidebarExpanded";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background font-dm-sans flex h-screen flex-col overflow-hidden text-[#1E1E1E]">
      {/* Top Bar */}
      <AdminTopbar />

      {/* Main Layout */}
      <div className="relative flex flex-1 overflow-hidden z-50">
        {/* Sidebar */}
        <AdminSidebarSmall />
        <AdminSidebarExpanded />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F9F9F9] px-4 pb-24 pt-5 md:px-[30px]">
          {children}
        </main>
      </div>
    </div>
  );
}
