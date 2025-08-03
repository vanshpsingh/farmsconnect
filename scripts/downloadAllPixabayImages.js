const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { url: 'https://cdn.pixabay.com/photo/2010/12/13/10/07/tomatoes-5356_1280.jpg', filename: 'tomatoes.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2018/03/01/14/40/milk-3196614_1280.jpg', filename: 'milk.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2017/06/20/19/22/wheat-2428741_1280.jpg', filename: 'wheat.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2015/03/24/08/54/eggs-686206_1280.jpg', filename: 'eggs.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2016/06/18/17/42/potatoes-1467302_1280.jpg', filename: 'potatoes.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2017/06/02/18/24/rice-2368029_1280.jpg', filename: 'rice.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/lentils-1238255_1280.jpg', filename: 'lentils.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/bananas-1238255_1280.jpg', filename: 'bananas.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2015/09/18/19/03/apples-942253_1280.jpg', filename: 'apples.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/mango-1238255_1280.jpg', filename: 'mangoes.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/grapes-1238255_1280.jpg', filename: 'grapes.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2012/03/01/00/32/corn-19624_1280.jpg', filename: 'corn.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2017/06/20/19/22/barley-2428741_1280.jpg', filename: 'barley.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/oranges-1238255_1280.jpg', filename: 'oranges.jpg' },
  { url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/pineapple-1238255_1280.jpg', filename: 'pineapple.jpg' },
];

const imagesDir = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  for (const img of images) {
    const dest = path.join(imagesDir, img.filename);
    try {
      console.log(`Downloading ${img.filename}...`);
      await downloadImage(img.url, dest);
      console.log(`Saved to ${dest}`);
    } catch (err) {
      console.error(`Error downloading ${img.filename}:`, err.message);
    }
  }
  console.log('All downloads complete!');
})(); 