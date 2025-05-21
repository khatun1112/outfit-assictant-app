"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { uploadImage } from "@/lib/blob"

// List of common image extensions
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"]

export default function CreateOutfit() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [urlError, setUrlError] = useState<string | null>(null)
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null)
  const [isCheckingUrl, setIsCheckingUrl] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageTestRef = useRef<HTMLImageElement | null>(null)

  // Function to validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  // Function to check if URL likely points to an image based on extension
  const hasImageExtension = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url)
      const pathname = parsedUrl.pathname.toLowerCase()
      return IMAGE_EXTENSIONS.some((ext) => pathname.endsWith(ext))
    } catch (e) {
      return false
    }
  }

  // Function to validate image URL
  const validateImageUrl = (url: string) => {
    setIsCheckingUrl(true)
    setUrlError(null)
    setIsUrlValid(null)

    // Check if URL is empty
    if (!url.trim()) {
      setIsCheckingUrl(false)
      setUrlError(null)
      setIsUrlValid(null)
      return
    }

    // Check if URL is properly formatted
    if (!isValidUrl(url)) {
      setIsCheckingUrl(false)
      setUrlError("Please enter a valid URL")
      setIsUrlValid(false)
      return
    }

    // Check if URL has an image extension
    if (!hasImageExtension(url)) {
      setIsCheckingUrl(false)
      setUrlError("URL doesn't appear to be an image (should end with .jpg, .png, etc.)")
      setIsUrlValid(false)
      return
    }

    // Create an image element to test if the URL loads
    const img = new Image()
    imageTestRef.current = img

    img.onload = () => {
      // Only update if this is still the current check
      if (imageTestRef.current === img) {
        setIsCheckingUrl(false)
        setIsUrlValid(true)
        setUrlError(null)
        setImagePreview(url)
      }
    }

    img.onerror = () => {
      // Only update if this is still the current check
      if (imageTestRef.current === img) {
        setIsCheckingUrl(false)
        setIsUrlValid(false)
        setUrlError("Image could not be loaded. It may be inaccessible or not exist.")
        setImagePreview("/placeholder.svg?height=300&width=300")
      }
    }

    // Set the source to trigger the load/error events
    img.src = url
  }

  // Debounce the URL validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (imageUrl) {
        validateImageUrl(imageUrl)
      }
    }, 500) // Wait 500ms after typing stops

    return () => {
      clearTimeout(timer)
      // Cancel any pending image loads
      if (imageTestRef.current) {
        imageTestRef.current.onload = null
        imageTestRef.current.onerror = null
        imageTestRef.current = null
      }
    }
  }, [imageUrl])

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImageUrl("") // Clear URL when file is selected
      setIsUrlValid(null)
      setUrlError(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setImageUrl(newUrl)
    setImageFile(null) // Clear file when URL is entered

    if (!newUrl.trim()) {
      setImagePreview(null)
      setIsUrlValid(null)
      setUrlError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form before submission
    if (imageUrl && !isUrlValid) {
      alert("Please fix the image URL issues before submitting.")
      return
    }

    setIsSubmitting(true)

    try {
      let finalImageUrl = "/placeholder.svg?height=300&width=300"

      // Use image URL if provided, otherwise upload the file
      if (imageUrl.trim() && isUrlValid) {
        finalImageUrl = imageUrl
      } else if (imageFile) {
        const result = await uploadImage(imageFile)
        if (result.success && result.url) {
          finalImageUrl = result.url
        }
      }

      // In a real app, this would send data to your Express backend
      const response = await fetch("http://localhost:3001/api/outfits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          tags,
          image: finalImageUrl,
        }),
      })

      if (response.ok) {
        router.push("/")
      } else {
        console.error("Failed to create outfit")
      }
    } catch (error) {
      console.error("Error creating outfit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <CardTitle>Create New Outfit</CardTitle>
            <CardDescription className="text-pink-100">Add details about your new outfit combination</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name">Outfit Name</Label>
                <Input
                  id="name"
                  placeholder="Summer Casual"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your outfit..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                    <TabsTrigger value="url">Image URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                      onClick={handleImageClick}
                    >
                      <input
                        type="file"
                        id="image-file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />

                      {imagePreview && !imageUrl ? (
                        <div className="relative w-full h-48 mb-4">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            fill
                            className="object-contain rounded-md"
                          />
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="url">
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          id="image-url"
                          placeholder="https://example.com/image.jpg"
                          value={imageUrl}
                          onChange={handleImageUrlChange}
                          className={`pr-10 ${
                            isUrlValid === true
                              ? "border-green-500 focus-visible:ring-green-500"
                              : isUrlValid === false
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                          }`}
                        />
                        {isCheckingUrl && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
                          </div>
                        )}
                        {!isCheckingUrl && isUrlValid === true && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {!isCheckingUrl && isUrlValid === false && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                      </div>

                      {urlError && (
                        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{urlError}</AlertDescription>
                        </Alert>
                      )}

                      {imagePreview && imageUrl && isUrlValid && (
                        <div className="relative w-full h-48 border rounded-md overflow-hidden">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="URL Preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex">
                  <Input
                    id="tags"
                    placeholder="Add tags (e.g., summer, casual)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    className="ml-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      {tag}
                      <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t p-6">
              <Button type="button" variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                disabled={isSubmitting || (imageUrl !== "" && !isUrlValid)}
              >
                {isSubmitting ? "Saving..." : "Save Outfit"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
