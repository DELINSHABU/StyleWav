const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'jsonDatabase', 'products.json');

// Define complete product data
const productUpdates = {
  "sw-002": {
    description: "Clean and minimalist design meets bold statement. This monochrome graphic tee features high-quality printing on soft cotton fabric.",
    category: "Graphic Tees",
    images: ["/monochrome-tee.jpg", "/monochrome-tee-2.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
    sizeStock: { "S": 150, "M": 200, "L": 300, "XL": 100 }
  },
  "sw-003": {
    description: "Throwback vibes with modern comfort. This retro script tee brings vintage aesthetics to your contemporary wardrobe.",
    category: "Vintage",
    images: ["/retro-script-tee.jpg", "/retro-script-tee-2.jpg", "/retro-script-tee-3.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Cream", "Brown", "Green"],
    sizeStock: { "S": 80, "M": 150, "L": 200, "XL": 180, "XXL": 120 }
  },
  "sw-004": {
    description: "The essential black tee every wardrobe needs. Premium cotton construction with perfect fit and lasting comfort.",
    category: "Essentials",
    images: ["/black-tee-minimal.jpg", "/black-tee-minimal-2.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    sizeStock: { "XS": 50, "S": 100, "M": 200, "L": 300, "XL": 200, "XXL": 150 }
  },
  "sw-005": {
    description: "Electric style meets street fashion. Bold neon prints that glow under UV light, perfect for festivals and night outs.",
    category: "Streetwear",
    images: ["/neon-print-tee.jpg", "/neon-print-tee-2.jpg", "/neon-print-tee-glow.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Neon Green", "Electric Blue", "Hot Pink"],
    sizeStock: { "S": 200, "M": 250, "L": 300, "XL": 243 }
  },
  "sw-006": {
    description: "Loose, comfortable fit inspired by skate culture. Durable construction that can handle your active lifestyle.",
    category: "Streetwear",
    images: ["/skater-fit-tee.jpg", "/skater-fit-tee-2.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gray", "Black", "Navy"],
    sizeStock: { "S": 180, "M": 200, "L": 280, "XL": 200, "XXL": 133 }
  },
  "sw-007": {
    description: "Subtle branding, maximum style. Clean design with small logo placement for those who prefer understated fashion.",
    category: "Essentials",
    images: ["/minimal-logo-tee.jpg", "/minimal-logo-tee-2.jpg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Gray", "Navy"],
    sizeStock: { "XS": 150, "S": 200, "M": 250, "L": 200, "XL": 198 }
  },
  "sw-008": {
    description: "Your go-to tee for everyday wear. Super soft cotton blend that gets softer with every wash. Perfect for layering or wearing solo.",
    category: "Essentials",
    images: ["/plain-tee-comfort.jpg", "/plain-tee-comfort-2.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Gray", "Black", "Navy", "Olive"],
    sizeStock: { "XS": 100, "S": 150, "M": 200, "L": 250, "XL": 200, "XXL": 97 }
  }
};

async function completeProductData() {
  try {
    console.log('Reading products file...');
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);

    console.log(`Found ${products.length} products`);

    products.forEach(product => {
      console.log(`\nProcessing: ${product.name} (${product.id})`);
      
      const updates = productUpdates[product.id];
      if (updates) {
        // Apply all updates
        Object.keys(updates).forEach(key => {
          product[key] = updates[key];
          console.log(`  - Updated ${key}: ${JSON.stringify(updates[key])}`);
        });

        // Calculate total stock from size stock
        if (product.sizeStock) {
          const totalStock = Object.values(product.sizeStock).reduce((sum, stock) => sum + stock, 0);
          product.stockQuantity = totalStock;
          console.log(`  - Updated stockQuantity to: ${totalStock}`);
          
          // Update inStock status
          if (!product.unlimitedStock) {
            product.inStock = totalStock > 0;
            console.log(`  - Set inStock: ${product.inStock}`);
          }
        }
      } else {
        console.log(`  - No updates defined for this product`);
      }
    });

    // Write back to file
    console.log('\nWriting updated products back to file...');
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    console.log('Successfully updated products.json');

    // Display summary
    console.log('\n=== Final Summary ===');
    products.forEach(product => {
      const totalStock = product.sizeStock 
        ? Object.values(product.sizeStock).reduce((sum, stock) => sum + stock, 0)
        : product.stockQuantity;
      
      console.log(`${product.name}:`);
      console.log(`  - Stock: ${totalStock}, In Stock: ${product.inStock}`);
      console.log(`  - Category: ${product.category || 'N/A'}`);
      console.log(`  - Sizes: ${product.sizes ? product.sizes.join(', ') : 'N/A'}`);
      if (product.sizeStock) {
        console.log(`  - Size breakdown: ${JSON.stringify(product.sizeStock)}`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('Error updating product data:', error);
  }
}

// Run the script
completeProductData();