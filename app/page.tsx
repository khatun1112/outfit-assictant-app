import Link from "next/link"
import { Button } from "@/components/ui/button"
import { OutfitCard } from "@/components/outfit-card"
import { PlusCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Outfit Assistant
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Your personal style companion. Create, save, and browse your favorite outfit combinations.
          </p>
        </header>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-purple-800">My Outfits</h2>
          <Link href="/create">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Outfit
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OutfitCard
            id="1"
            name="Summer Casual"
            description="Light and comfortable for warm days"
            image="/p2.jpg"
            tags={["summer", "casual", "daytime"]}
          />
          <OutfitCard
            id="2"
            name="Office Chic"
            description="Professional but stylish for work"
            image="/images.jfif"
            tags={["work", "formal", "professional"]}
          />
          <OutfitCard
            id="3"
            name="Night Out"
            description="Elegant outfit for evening events"
            image="/images (1).jfif"
            tags={["evening", "elegant", "party"]}
          />
          <OutfitCard
            id="4"
            name="Weekend Comfort"
            description="Relaxed style for weekend activities"
            image="/weekend-outfit-ideas.jpg"
            tags={["weekend", "casual", "comfortable"]}
          />
          <OutfitCard
            id="5"
            name="Workout Ready"
            description="Functional attire for exercise"
            image="/Cold_weather_outfit.jpg"
            tags={["fitness", "active", "sports"]}
          />
          <OutfitCard
            id="6"
            name="Date Night"
            description="Romantic and stylish for special occasions"
            image="/download.jfif"
            tags={["date", "elegant", "evening"]}
          />
        </div>
      </div>
    </div>
  )
}
