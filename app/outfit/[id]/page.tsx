"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface Outfit {
  id: string
  name: string
  description: string
  image: string
  tags: string[]
}

export default function OutfitDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [outfit, setOutfit] = useState<Outfit | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from your Express backend
    // Simulating API call with mock data
    const fetchOutfit = async () => {
      try {
        // This would be a real API call in production
        // const response = await fetch(`http://localhost:3001/api/outfits/${params.id}`)
        // const data = await response.json()

        // Mock data for demonstration
      const outfitMap: Record<string, Outfit> = {
        "1": {
          id: "1",
          name: "Summer Casual",
          description: "Light and comfortable for warm days",
          image: "/p2.jpg",
          tags: ["summer", "casual", "daytime"],
        },
        "2": {
          id: "2",
          name: "Office Chic",
          description: "Professional but stylish for work",
          image: "/images.jfif",
          tags: ["work", "formal", "professional"],
        },
        "3": {
          id: "3",
          name: "Evening Elegance",
          description: "Perfect for formal dinners or evening events",
          image: "/images (1).jfif",
          tags: ["evening", "formal", "elegant"],
        },
        "4": {
          id: "4",
          name: "Winter Layers",
          description: "Warm and cozy for chilly days",
          image: "/weekend-outfit-ideas.jpg",
          tags: ["winter", "layered", "cozy"],
        },
        "5": {
          id: "5",
          name: "Sporty Vibes",
          description: "Ideal for an active, on-the-go lifestyle",
          image: "/Cold_weather_outfit.jpg",
          tags: ["sporty", "casual", "comfortable"],
        },
        "6": {
          id: "6",
          name: "Date Night",
          description: "Stylish and romantic outfit for a special evening",
          image: "/download.jfif",
          tags: ["romantic", "stylish", "evening"],
        },
      };

      // Fallback if ID not found
      const mockOutfit = outfitMap[params.id] || {
        id: params.id,
        name: "Unknown Outfit",
        description: "No description available.",
        image: "/p1.jpg",
        tags: ["unknown"],
      };

      setOutfit(mockOutfit);



        setOutfit(mockOutfit)
      } catch (error) {
        console.error("Error fetching outfit:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOutfit()
  }, [params.id])

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this outfit?")) {
      try {
        // In a real app, this would send a request to your Express backend
        // await fetch(`http://localhost:3001/api/outfits/${params.id}`, {
        //   method: "DELETE",
        // })

        router.push("/")
      } catch (error) {
        console.error("Error deleting outfit:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <p className="text-lg text-purple-800">Loading outfit details...</p>
      </div>
    )
  }

  if (!outfit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <p className="text-lg text-purple-800">Outfit not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-12">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-purple-700 hover:text-purple-900 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all outfits
        </Link>

        <Card className="max-w-4xl mx-auto shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <CardTitle className="text-2xl">{outfit.name}</CardTitle>
            <CardDescription className="text-pink-100">{outfit.description}</CardDescription>
          </CardHeader>

          <div className="md:flex">
            <div className="md:w-1/2 relative h-[300px] md:h-auto">
              <Image
                src={outfit.image || "/p1.jpg"}
                alt={outfit.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            <CardContent className="md:w-1/2 p-6 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-purple-800 mb-2">Details</h3>
                <p className="text-gray-700">{outfit.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-purple-800 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {outfit.tags.map((tag) => (
                    <Badge key={tag} className="bg-purple-100 text-purple-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-purple-800 mb-2">When to Wear</h3>
                <p className="text-gray-700">
                  {outfit.tags.includes("summer")
                    ? "Perfect for warm summer days when you want to stay cool while looking stylish."
                    : "Ideal for professional settings where you want to make a good impression while staying comfortable."}
                </p>
              </div>
            </CardContent>
          </div>

          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>

            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              onClick={() => router.push(`/edit/${outfit.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Outfit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
