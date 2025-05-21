import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShirtIcon as Tshirt, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Tshirt className="h-6 w-6 text-purple-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Outfit Assistant
          </span>
        </Link>

        <div className="hidden md:flex items-center w-1/3">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search outfits..." className="w-full pl-9 bg-gray-50 border-gray-200" />
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/create">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              Create Outfit
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-gray-700">
            <User className="h-5 w-5" />
            <span className="sr-only">User account</span>
          </Button>
        </nav>
      </div>
    </header>
  )
}
