const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'jsonDatabase', 'products.json');

// Define default size stocks for each product
const sizeStockDefaults = {
  "sw-002": { "S": 150, "M": 200, "L": 300, "XL": 100 }, // Monochrome Graphic Tee
  "sw-003": { "S": 80, "M": 150, "L": 200, "XL": 180, "XXL": 120 }, // Retro Script Tee
  "sw-004": { "XS": 50, "S": 100, "M": 200, "L": 300, "XL": 200, "XXL": 150 }, // Core Black Tee 
  "sw-005": { "S": 200, "M": 250, "L": 300, "XL": 243 }, // Neon Print Tee
  "sw-006": { "S": 180, "M": 200, "L": 280, "XL": 200, "XXL": 133 }, // Skater Fit Tee
  "sw-007": { "XS": 150, "S": 200, "M": 250, "L": 200, "XL": 198 }, // Minimal Logo Tee
  "sw-008": { "XS": 100, "S": 150, "M": 200, "L": 250, "XL": 200, "XXL": 97 } // Daily Comfort Tee
};

async function addSizeStockToProducts() {
  try {
    console.log('Reading products file...');
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);

    console.log(`Found ${products.length} products`);

    products.forEach(product => {
      console.log(`\nProcessing: ${product.name} (${product.id})`);
      
      // If product doesn't have sizeStock but has sizes, add sizeStock
      if (!product.sizeStock && product.sizes && product.sizes.length > 0) {
        if (sizeStockDefaults[product.id]) {
          product.sizeStock = sizeStockDefaults[product.id];
          console.log(`  - Added predefined size stock: ${JSON.stringify(product.sizeStock)}`);
        } else {
          // Distribute current stock across sizes
          const currentStock = product.stockQuantity || 100;
          const stockPerSize = Math.floor(currentStock / product.sizes.length);
          const remainder = currentStock % product.sizes.length;
          
          product.sizeStock = {};
          product.sizes.forEach((size, index) => {
            product.sizeStock[size] = stockPerSize + (index < remainder ? 1 : 0);
          });
          
          console.log(`  - Distributed stock across sizes: ${JSON.stringify(product.sizeStock)}`);
        }

        // Update total stock quantity
        const totalStock = Object.values(product.sizeStock).reduce((sum, stock) => sum + stock, 0);
        product.stockQuantity = totalStock;
        console.log(`  - Updated stockQuantity to: ${totalStock}`);

        // Update inStock status
        if (!product.unlimitedStock) {
          product.inStock = totalStock > 0;
          console.log(`  - Set inStock: ${product.inStock}`);
        }
      } else if (product.sizeStock) {
        console.log(`  - Already has size stock: ${JSON.stringify(product.sizeStock)}`);
      } else {
        console.log(`  - No sizes defined, skipping`);
      }

      // Add missing fields from database defaults
      if (!product.description) product.description = getDefaultDescription(product.id);
      if (!product.category) product.category = getDefaultCategory(product.id);
      if (!product.colors) product.colors = getDefaultColors(product.id);
      if (!product.images) product.images = getDefaultImages(product.id);
    });

    // Write back to file
    console.log('\nWriting updated products back to file...');
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    console.log('Successfully updated products.json');

    // Display summary
    console.log('\n=== Summary ===');
    products.forEach(product => {
      const totalStock = product.sizeStock 
        ? Object.values(product.sizeStock).reduce((sum, stock) => sum + stock, 0)
        : product.stockQuantity;
      
      console.log(`${product.name}: Total Stock = ${totalStock}, In Stock = ${product.inStock}`);
      if (product.sizeStock) {
        console.log(`  Size breakdown: ${JSON.stringify(product.sizeStock)}`);
      }
    });

  } catch (error) {
    console.error('Error adding size stock to products:', error);
  }
}

function getDefaultDescription(productId) {
  const descriptions = {
    "sw-002": "Clean and minimalist design meets bold statement. This monochrome graphic tee features high-quality printing on soft cotton fabric.",
    "sw-003": "Throwback vibes with modern comfort. This retro script tee brings vintage aesthetics to your contemporary wardrobe.",
    "sw-004": "The essential black tee every wardrobe needs. Premium cotton construction with perfect fit and lasting comfort.",
    "sw-005": "Electric style meets street fashion. Bold neon prints that glow under UV light, perfect for festivals and night outs.",
    "sw-006": "Loose, comfortable fit inspired by skate culture. Durable construction that can handle your active lifestyle.",
    "sw-007": "Subtle branding, maximum style. Clean design with small logo placement for those who prefer understated fashion.",
    "sw-008": "Your go-to tee for everyday wear. Super soft cotton blend that gets softer with every wash. Perfect for layering or wearing solo."
  };
  return descriptions[productId] || "";
}

function getDefaultCategory(productId) {
  const categories = {
    "sw-002": "Graphic Tees",
    "sw-003": "Vintage", 
    "sw-004": "Essentials",
    "sw-005": "Streetwear",
    "sw-006": "Streetwear",
    "sw-007": "Essentials",
    "sw-008": "Essentials"
  };
  return categories[productId] || "";
}

function getDefaultColors(productId) {
  const colors = {
    "sw-002": ["Black", "White"],
    "sw-003": ["Cream", "Brown", "Green"],
    "sw-004": ["Black"],
    "sw-005": ["Neon Green", "Electric Blue", "Hot Pink"],
    "sw-006": ["Gray", "Black", "Navy"],
    "sw-007": ["White", "Gray", "Navy"],
    "sw-008": ["White", "Gray", "Black", "Navy", "Olive"]
  };
  return colors[productId] || [];
}

function getDefaultImages(productId) {
  const images = {
    "sw-002": ["/monochrome-tee.jpg", "/monochrome-tee-2.jpg"],
    "sw-003": ["/retro-script-tee.jpg", "/retro-script-tee-2.jpg", "/retro-script-tee-3.jpg"],
    "sw-004": ["/black-tee-minimal.jpg", "/black-tee-minimal-2.jpg"],
    "sw-005": ["/neon-print-tee.jpg", "/neon-print-tee-2.jpg", "/neon-print-tee-glow.jpg"],
    "sw-006": ["/skater-fit-tee.jpg", "/skater-fit-tee-2.jpg"],
    "sw-007": ["/minimal-logo-tee.jpg", "/minimal-logo-tee-2.jpg"],
    "sw-008": ["/plain-tee-comfort.jpg", "/plain-tee-comfort-2.jpg"]
  };
  return images[productId] || [];
}

// Run the script
addSizeStockToProducts();