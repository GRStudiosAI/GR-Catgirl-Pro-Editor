const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

const iconsDir = path.join(__dirname, '../public/icons');

const pngSrc = path.join(iconsDir, 'android-chrome-512x512.png');
const pngDst = path.join(iconsDir, 'icon.png');
const icoDst = path.join(iconsDir, 'icon.ico');

async function run() {
    try {
        if (!fs.existsSync(pngSrc)) {
            console.error(`Source PNG not found at ${pngSrc}`);
            process.exit(1);
        }

        console.log(`Reading high-res source PNG at ${pngSrc}...`);
        const img = await Jimp.read(pngSrc);
        
        // Resize to exactly 256x256 pixels
        const resized = img.resize({ w: 256, h: 256 });
        
        // Save the 256x256 PNG to icon.png
        await resized.write(pngDst);
        console.log(`Successfully generated 256x256 PNG at ${pngDst}`);

        // Get 256x256 PNG buffer
        const pngBuffer = await resized.getBuffer('image/png');

        const icoHeader = Buffer.alloc(22);
        
        // ICO Header (6 bytes)
        icoHeader.writeUInt16LE(0, 0);     // Reserved (must be 0)
        icoHeader.writeUInt16LE(1, 2);     // Type (1 = ICO)
        icoHeader.writeUInt16LE(1, 4);     // Count (1 image)

        // Directory Entry (16 bytes)
        icoHeader.writeUInt8(0, 6);        // Width (0 means 256 or more)
        icoHeader.writeUInt8(0, 7);        // Height (0 means 256 or more)
        icoHeader.writeUInt8(0, 8);        // Color count (0)
        icoHeader.writeUInt8(0, 9);        // Reserved (must be 0)
        icoHeader.writeUInt16LE(1, 10);    // Planes (1)
        icoHeader.writeUInt16LE(32, 12);   // BPP (32-bit color depth)
        icoHeader.writeUInt32LE(pngBuffer.length, 14); // Size of the PNG image data
        icoHeader.writeUInt32LE(22, 18);   // Offset of the PNG data (22 bytes)

        const icoBuffer = Buffer.concat([icoHeader, pngBuffer]);
        fs.writeFileSync(icoDst, icoBuffer);
        console.log(`Successfully generated high-resolution 256x256 ICO at ${icoDst}.`);

    } catch (err) {
        console.error('Error running copy-assets:', err);
        process.exit(1);
    }
}

run();

