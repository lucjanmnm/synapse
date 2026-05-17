"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ScrollText, LineChart, Sparkles, CalendarDays, Settings, BrainCircuit, ClipboardList } from "lucide-react"

const nav = [
  { href: "/dashboard", label: "Dashboard",     icon: LayoutDashboard },
  { href: "/log",       label: "Logs",          icon: ScrollText       },
  { href: "/insights",  label: "Insights",      icon: LineChart        },
  { href: "/prompts",   label: "AI Prompts",    icon: Sparkles         },
  { href: "/review",    label: "Weekly Review", icon: ClipboardList    },
  { href: "/calendar",  label: "Kalendarz",     icon: CalendarDays     },
  { href: "/settings",  label: "Ustawienia",    icon: Settings         },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <div className="p-4 flex flex-col gap-1 h-full">
        <div className="flex items-center gap-2 px-3 py-4 mb-2">
          <BrainCircuit className="w-5 h-5" />
          <div>
            <p className="font-medium text-sm leading-none">Synapse</p>
            <p className="text-xs text-muted-foreground">Second Brain</p>
          </div>
        </div>
        {nav.map(item => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
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