"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, ScrollText, LineChart, Sparkles, CalendarDays, Settings, BrainCircuit, ClipboardList } from "lucide-react"

const nav = [
  { href: "/dashboard", label: "Dashboard",     icon: LayoutDashboard },
  { href: "/log",       label: "Logs",          icon: ScrollText       },
  { href: "/insights",  label: "Insights",      icon: LineChart        },
  { href: "/prompts",   label: "AI Prompts",    icon: Sparkles         },
  { href: "/review",    label: "Weekly Review", icon: ClipboardList    },
  { href: "/calendar",  label: "Kalendarz",     icon: CalendarDays     },
  { href: "/settings",  label: "Ustawienia",    icon: Settings         },
]

export function MobileDrawer() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Top bar na mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5" />
          <span className="font-medium text-sm">Synapse</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`md:hidden fixed top-0 right-0 z-50 h-full w-72 bg-background border-l border-border p-4 flex flex-col gap-1 transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex items-center justify-between px-3 py-4 mb-2">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" />
            <div>
              <p className="font-medium text-sm leading-none">Synapse</p>
              <p className="text-xs text-muted-foreground">Second Brain</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {nav.map(item => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </>
  )
}