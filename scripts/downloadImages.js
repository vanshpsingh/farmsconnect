const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    // Tomatoes
    { url: 'https://cdn.pixabay.com/photo/2010/12/13/10/07/tomatoes-5356_1280.jpg', filename: 'tomatoes.jpg' },
    // Milk
    { url: 'https://cdn.pixabay.com/photo/2018/03/01/14/40/milk-3196614_1280.jpg', filename: 'milk.jpg' },
    // Wheat
    { url: 'https://cdn.pixabay.com/photo/2017/06/20/19/22/wheat-2428741_1280.jpg', filename: 'wheat.jpg' },
    // Eggs
    { url: 'https://cdn.pixabay.com/photo/2015/03/24/08/54/eggs-686206_1280.jpg', filename: 'eggs.jpg' },
    // Potatoes
    { url: 'https://cdn.pixabay.com/photo/2016/06/18/17/42/potatoes-1467302_1280.jpg', filename: 'potatoes.jpg' },
    // Rice
    { url: 'https://cdn.pixabay.com/photo/2017/06/02/18/24/rice-2368029_1280.jpg', filename: 'rice.jpg' },
    // Lentils
    { url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/lentils-1238255_1280.jpg', filename: 'lentils.jpg' },
    // Bananas
    { url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/bananas-1238255_1280.jpg', filename: 'bananas.jpg' },
    // Apples
    { url: 'https://cdn.pixabay.com/photo/2015/09/18/19/03/apples-942253_1280.jpg', filename: 'apples.jpg' },
    // Mangoes
    { url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/mango-1238255_1280.jpg', filename: 'mangoes.jpg' },
    // Grapes
    { url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/grapes-1238255_1280.jpg', filename: 'grapes.jpg' },
    // Corn
    { url: 'https://cdn.pixabay.com/photo/2012/03/01/00/32/corn-19624_1280.jpg', filename: 'corn.jpg' },
    // Barley
    { url: 'https://cdn.pixabay.com/photo/2017/06/20/19/22/barley-2428741_1280.jpg', filename: 'barley.jpg' },
    // Oranges
    { url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/oranges-1238255_1280.jpg', filename: 'oranges.jpg' },
    // Pineapple
    { url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/pineapple-1238255_1280.jpg', filename: 'pineapple.jpg' },
];

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filepath = path.join(__dirname, '..', 'public', 'images', filename);
        const file = fs.createWriteStream(filepath);

        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
};

async function downloadAllImages() {
    try {
        // Create images directory if it doesn't exist
        const imagesDir = path.join(__dirname, '..', 'public', 'images');
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        // Download all images
        for (const image of images) {
            await downloadImage(image.url, image.filename);
        }
        console.log('All images downloaded successfully');
    } catch (error) {
        console.error('Error downloading images:', error);
    }
}

downloadAllImages(); 