const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'jsonDatabase', 'products.json');

async function fixProductStockData() {
  try {
    console.log('Reading products file...');
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);

    console.log(`Found ${products.length} products`);

    // Update each product to have consistent stock data
    products.forEach(product => {
      console.log(`\nProcessing: ${product.name} (${product.id})`);
      
      if (product.sizeStock) {
        // Calculate total from size stock
        const totalFromSizes = Object.values(product.sizeStock).reduce((sum, stock) => sum + stock, 0);
        const oldStock = product.stockQuantity;
        product.stockQuantity = totalFromSizes;
        
        console.log(`  - Has size stock: ${JSON.stringify(product.sizeStock)}`);
        console.log(`  - Updated stockQuantity: ${oldStock} -> ${totalFromSizes}`);
      } else {
        // Add default sizeStock if product has sizes but no sizeStock
        if (product.sizes && product.sizes.length > 0) {
          const currentStock = product.stockQuantity || 0;
          const stockPerSize = Math.floor(currentStock / product.sizes.length);
          const remainder = currentStock % product.sizes.length;
          
          product.sizeStock = {};
          product.sizes.forEach((size, index) => {
            product.sizeStock[size] = stockPerSize + (index < remainder ? 1 : 0);
          });
          
          console.log(`  - Created size stock distribution: ${JSON.stringify(product.sizeStock)}`);
          console.log(`  - Total distributed: ${Object.values(product.sizeStock).reduce((sum, stock) => sum + stock, 0)}`);
        }
      }

      // Ensure inStock is properly set
      const totalStock = product.stockQuantity || 0;
      if (!product.unlimitedStock) {
        product.inStock = totalStock > 0;
        console.log(`  - Set inStock: ${product.inStock} (total stock: ${totalStock})`);
      }
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
    console.error('Error fixing product stock data:', error);
  }
}

// Run the script
fixProductStockData();