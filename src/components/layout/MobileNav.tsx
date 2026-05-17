"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ScrollText, LineChart, Sparkles, ClipboardList } from "lucide-react"

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/log",       label: "Logs",      icon: ScrollText       },
  { href: "/insights",  label: "Insights",  icon: LineChart        },
  { href: "/prompts",   label: "Prompts",   icon: Sparkles         },
  { href: "/review",    label: "Review",    icon: ClipboardList    },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border px-2 py-2 flex justify-around">
      {nav.map(item => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              pathname === item.href ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}