import { Sidebar } from "@/components/layout/Sidebar"
import { MobileDrawer } from "@/components/layout/MobileDrawer"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:block w-56 shrink-0">
        <div className="fixed top-0 left-0 w-56 h-screen border-r border-border overflow-y-auto">
          <Sidebar />
        </div>
      </aside>
      <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8 pt-16 md:pt-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
      <MobileDrawer />
    </div>
  )
}