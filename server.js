import express from "express"
import cors from "cors"
import { v4 as uuidv4 } from "uuid"
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const dataFilePath = path.join(__dirname, "data", "outfits.json")

async function ensureDataDir() {
  try {
    await fs.mkdir(path.join(__dirname, "data"), { recursive: true })
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

async function initDataFile() {
  try {
    await fs.access(dataFilePath)
  } catch (error) {
    await fs.writeFile(dataFilePath, JSON.stringify([], null, 2))
  }
}

async function getOutfits() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading outfits:", error)
    return []
  }
}

async function saveOutfits(outfits) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(outfits, null, 2))
  } catch (error) {
    console.error("Error saving outfits:", error)
  }
}
;(async () => {
  await ensureDataDir()
  await initDataFile()
})()

app.get("/api/outfits", async (req, res) => {
  try {
    const outfits = await getOutfits()
    res.json(outfits)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch outfits" })
  }
})

app.get("/api/outfits/:id", async (req, res) => {
  try {
    const outfits = await getOutfits()
    const outfit = outfits.find((o) => o.id === req.params.id)

    if (!outfit) {
      return res.status(404).json({ error: "Outfit not found" })
    }

    res.json(outfit)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch outfit" })
  }
})

app.post("/api/outfits", async (req, res) => {
  try {
    const { name, description, tags, image } = req.body

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" })
    }

    const newOutfit = {
      id: uuidv4(),
      name,
      description,
      tags: tags || [],
      image: image || "/placeholder.svg?height=300&width=300",
      createdAt: new Date().toISOString(),
    }

    const outfits = await getOutfits()
    outfits.push(newOutfit)
    await saveOutfits(outfits)

    res.status(201).json(newOutfit)
  } catch (error) {
    res.status(500).json({ error: "Failed to create outfit" })
  }
})

app.put("/api/outfits/:id", async (req, res) => {
  try {
    const { name, description, tags, image } = req.body
    const outfits = await getOutfits()
    const index = outfits.findIndex((o) => o.id === req.params.id)

    if (index === -1) {
      return res.status(404).json({ error: "Outfit not found" })
    }

    outfits[index] = {
      ...outfits[index],
      name: name || outfits[index].name,
      description: description || outfits[index].description,
      tags: tags || outfits[index].tags,
      image: image || outfits[index].image,
      updatedAt: new Date().toISOString(),
    }

    await saveOutfits(outfits)
    res.json(outfits[index])
  } catch (error) {
    res.status(500).json({ error: "Failed to update outfit" })
  }
})

app.delete("/api/outfits/:id", async (req, res) => {
  try {
    const outfits = await getOutfits()
    const filteredOutfits = outfits.filter((o) => o.id !== req.params.id)

    if (filteredOutfits.length === outfits.length) {
      return res.status(404).json({ error: "Outfit not found" })
    }

    await saveOutfits(filteredOutfits)
    res.json({ message: "Outfit deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete outfit" })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
