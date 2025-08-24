import { v4 as uuidv4 } from 'uuid';

// Function to generate a random token name and symbol
export function generateTokenNameAndSymbol(): { name: string; symbol: string } {
    const adjectives = ['Super', 'Mega', 'Hyper', 'Crazy', 'Doge', 'Pepe', 'Moon', 'Rocket', 'Galaxy', 'Crypto'];
    const nouns = ['Coin', 'Token', 'Inu', 'Cat', 'Shiba', 'Elon', 'AI', 'Bot', 'Pump', 'Fun'];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    const name = `${randomAdjective} ${randomNoun} ${Math.floor(Math.random() * 1000)}`;
    const symbol = `${randomAdjective.substring(0, 1)}${randomNoun.substring(0, 2)}${Math.floor(Math.random() * 100)}`.toUpperCase();

    return { name, symbol };
}

// Function to generate a random token description
export function generateTokenDescription(name: string, symbol: string): string {
    const descriptions = [
        `Join the ${name} revolution! The next big thing on Solana.`, 
        `Get ready for ${name} ($${symbol}) to moon! Community-driven and fair launch.`, 
        `${name}: The ultimate meme coin for the degens. Don't miss out!`, 
        `Experience the power of ${name} ($${symbol}). Built for the community, by the community.`, 
        `Dive into the world of ${name}. A new era of decentralized finance.`, 
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// This function would ideally call media_generate_image and then upload to Arweave/IPFS
export async function uploadImageAndGetUri(name: string, symbol: string): Promise<string> {
    const imagePath = `/home/ubuntu/pumpfun-bot/images/${symbol}_${uuidv4()}.png`;
    const prompt = `A vibrant and eye-catching logo for a cryptocurrency token named ${name} with symbol ${symbol}. The logo should be modern, clean, and convey a sense of community and growth. Incorporate elements related to ${name.toLowerCase().includes('doge') || name.toLowerCase().includes('inu') ? 'a cute dog' : name.toLowerCase().includes('cat') ? 'a playful cat' : 'abstract shapes'} and the Solana blockchain.`;

    // Simulate image generation and local saving
    console.log(`Simulating image generation for ${name} ($${symbol}) to ${imagePath} with prompt: ${prompt}`);
    // In a real scenario, you would call media_generate_image here.
    // Example: await media_generate_image({ brief: 'Generating token logo', images: [{ path: imagePath, prompt: prompt, aspect_ratio: 'square' }] });

    // For now, return a placeholder URI. In a real scenario, this would be the URI from Arweave/IPFS.
    const placeholderImages = [
        'https://arweave.net/placeholder_image_1',
        'https://arweave.net/placeholder_image_2',
        'https://arweave.net/placeholder_image_3',
    ];
    return placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
}

// Function to generate the full metadata JSON and upload it
export async function generateAndUploadMetadata(name: string, symbol: string, description: string, imageUrl: string): Promise<string> {
    const metadata = {
        name: name,
        symbol: symbol,
        description: description,
        image: imageUrl,
        // Add other metadata fields as needed, e.g., external_url, attributes
    };

    // In a real scenario, this JSON would be uploaded to Arweave/IPFS.
    // For now, we'll just stringify it and return a placeholder URI.
    console.log(`Uploading metadata for ${name} ($${symbol})... (Placeholder)`);
    const metadataJson = JSON.stringify(metadata, null, 2);
    console.log("Generated Metadata:\n", metadataJson);

    // Example: A random URI for the metadata JSON
    const placeholderMetadataUris = [
        'https://arweave.net/metadata_placeholder_1',
        'https://arweave.net/metadata_placeholder_2',
        'https://arweave.net/metadata_placeholder_3',
    ];
    return placeholderMetadataUris[Math.floor(Math.random() * placeholderMetadataUris.length)];
}


