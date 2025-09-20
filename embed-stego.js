const fs = require('fs');
const crypto = require('crypto');

// PART2 word and its MD5 hash
const PART2 = 'FOUNTAIN';
const PART2_MD5 = crypto.createHash('md5').update(PART2).digest('hex');

console.log('PART2:', PART2);
console.log('MD5:', PART2_MD5);
console.log('Final flag: flag{IN_FRONT_OF_' + PART2 + '}');

// Create a simple PNG with embedded text data
const createStegoPNG = () => {
    // PNG signature
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    // IHDR chunk
    const width = 200;
    const height = 200;
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData[8] = 8;  // bit depth
    ihdrData[9] = 2;  // color type (RGB)
    ihdrData[10] = 0; // compression
    ihdrData[11] = 0; // filter
    ihdrData[12] = 0; // interlace
    
    const ihdrChunk = createChunk('IHDR', ihdrData);
    
    // Create image data (simple gradient)
    const imageData = Buffer.alloc(width * height * 3);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 3;
            imageData[idx] = Math.floor((x / width) * 255);     // R
            imageData[idx + 1] = Math.floor((y / height) * 255); // G
            imageData[idx + 2] = 150;                           // B
        }
    }
    
    // Compress image data
    const zlib = require('zlib');
    const compressedData = zlib.deflateSync(imageData);
    const idatChunk = createChunk('IDAT', compressedData);
    
    // Create tEXt chunk with our payload (MD5 + Base64)
    const base64Part2 = Buffer.from(PART2, 'utf8').toString('base64');
    const payload = `PART1: IN_FRONT_OF\nHASH: ${PART2_MD5}\nBASE64: ${base64Part2}`;
    const textData = Buffer.concat([
        Buffer.from('Comment\0'), // keyword
        Buffer.from(payload, 'utf8') // text
    ]);
    const textChunk = createChunk('tEXt', textData);
    
    // IEND chunk
    const iendChunk = createChunk('IEND', Buffer.alloc(0));
    
    // Combine all chunks
    const png = Buffer.concat([
        signature,
        ihdrChunk,
        idatChunk,
        textChunk,
        iendChunk
    ]);
    
    return png;
};

// Helper function to create PNG chunks
const createChunk = (type, data) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    
    const typeBuffer = Buffer.from(type, 'ascii');
    const chunk = Buffer.concat([length, typeBuffer, data]);
    
    // Calculate CRC32 (simplified version)
    const crc32 = (buf) => {
        let crc = 0xffffffff;
        for (let i = 0; i < buf.length; i++) {
            crc ^= buf[i];
            for (let j = 0; j < 8; j++) {
                crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
            }
        }
        return (crc ^ 0xffffffff) >>> 0;
    };
    
    const crc = crc32(Buffer.concat([typeBuffer, data]));
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc, 0);
    
    return Buffer.concat([chunk, crcBuffer]);
};

// Create the stego PNG
const stegoPNG = createStegoPNG();
fs.writeFileSync('public/assets/suspect.png', stegoPNG);

console.log('\nStego PNG created successfully!');
console.log('File size:', stegoPNG.length, 'bytes');
console.log('Location: public/assets/suspect.png');
console.log('\nEmbedded payload:');
console.log('PART1: IN_FRONT_OF');
console.log('HASH: 8d01676ad52c43fe0cb695ed248b9ce7 (MD5 of FOUNTAIN)');
console.log('BASE64: Rk9VTlRBSU4= (Base64 of FOUNTAIN)');
console.log('\nTo verify the embedded data, you can use:');
console.log('exiftool public/assets/suspect.png');
console.log('or');
console.log('strings public/assets/suspect.png | grep -E "(PART1|HASH|BASE64)"');
