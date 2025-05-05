import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sizes = [192, 384, 512]
const inputFile = path.join(__dirname, '../public/icons/logo.svg')
const outputDir = path.join(__dirname, '../public/icons')

async function generateIcons() {
  try {
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`)

      await sharp(inputFile).resize(size, size).png().toFile(outputFile)

      console.log(`Generated: ${outputFile}`)
    }

    // Generate splash screen
    const splashSource = path.join(__dirname, '../public/abayas/abaya1.webp')
    const splashOutput = path.join(outputDir, 'splash.png')

    await sharp(splashSource).resize(1080, 1920, { fit: 'cover' }).png().toFile(splashOutput)

    console.log(`Generated splash screen: ${splashOutput}`)
  } catch (error) {
    console.error('Error generating icons:', error)
  }
}

generateIcons()
