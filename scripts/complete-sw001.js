const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'jsonDatabase', 'products.json');

async function completeSW001Data() {
  try {
    console.log('Reading products file...');
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);

    const sw001 = products.find(p => p.id === 'sw-001');
    if (sw001) {
      sw001.description = "Ride the waves of style with this premium oversized graphic tee. Made from 100% cotton with a unique wave-inspired design that embodies the free-spirited lifestyle.";
      sw001.category = "Graphic Tees";
      sw001.images = ["/oversized-graphic-tee.png", "/oversized-graphic-tee-2.png", "/oversized-graphic-tee-3.png"];
      sw001.colors = ["Navy", "Black", "White"];
      sw001.rating = 4.8;
      sw001.reviews = 127;
      
      console.log('Updated sw-001 with missing data');
    }

    // Write back to file
    console.log('Writing updated products back to file...');
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    console.log('Successfully updated sw-001 data');

  } catch (error) {
    console.error('Error updating sw-001 data:', error);
  }
}

completeSW001Data();