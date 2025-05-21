import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface OutfitCardProps {
  id: string
  name: string
  description: string
  image: string
  tags: string[]
}

export function OutfitCard({ id, name, description, image, tags }: OutfitCardProps) {
  return (
    <Link href={`/outfit/${id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative h-48 w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xl text-purple-800">{name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              +{tags.length - 3}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
