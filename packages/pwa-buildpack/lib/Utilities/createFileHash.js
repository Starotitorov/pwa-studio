const fs = require('fs');
const crypto = require('crypto');

const DEFAULT_RANDOM_STRING = crypto.randomBytes(8).toString('hex');

function createFileHash(filePath) {
    const result = new Promise(resolve => {
        try {
            if (fs.existsSync(filePath)) {
                const fileStream = fs.createReadStream(filePath);
                const hash = crypto.createHash('md5');
                hash.setEncoding('hex');

                fileStream.on('end', function() {
                    hash.end();
                    resolve(hash.read());
                });

                fileStream.on('error', function() {
                    hash.end();
                    console.error(`Unable to read file ${filePath}`);
                    resolve(DEFAULT_RANDOM_STRING);
                });

                fileStream.pipe(hash);
            } else {
                throw new Error(`Error reading file ${filePath}`);
            }
        } catch (err) {
            console.error(`Unable to create hash of ${filePath}`, err);
            resolve(DEFAULT_RANDOM_STRING);
        }
    });

    return result;
}

module.exports = createFileHash;