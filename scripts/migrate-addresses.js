const fs = require('fs')
const path = require('path')

const DB_PATH = path.join(process.cwd(), 'jsonDatabase', 'customers.json')

console.log('🔄 Starting address migration...')

try {
  // Read customers file
  const data = fs.readFileSync(DB_PATH, 'utf-8')
  const customers = JSON.parse(data)
  
  console.log(`📋 Found ${customers.length} customers`)
  
  let updatedCount = 0
  
  // Update each customer's addresses
  customers.forEach(customer => {
    if (customer.addresses && customer.addresses.length > 0) {
      customer.addresses = customer.addresses.map((address, index) => {
        // Add ID if it doesn't exist
        if (!address.id) {
          const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          address.id = addressId
          
          // Set first address as default
          address.isDefault = index === 0
          
          updatedCount++
          console.log(`  ✅ Added ID to address for ${customer.email}`)
        }
        return address
      })
      
      // Update defaultShippingAddress to include id and isDefault
      if (customer.defaultShippingAddress && !customer.defaultShippingAddress.id) {
        customer.defaultShippingAddress = {
          ...customer.defaultShippingAddress,
          id: customer.addresses[0].id,
          isDefault: true
        }
      }
    }
  })
  
  // Write back to file
  fs.writeFileSync(DB_PATH, JSON.stringify(customers, null, 2), 'utf-8')
  
  console.log(`\n✅ Migration completed!`)
  console.log(`   - Updated ${updatedCount} addresses`)
  console.log(`   - Total customers: ${customers.length}`)
  
} catch (error) {
  console.error('❌ Migration failed:', error)
  process.exit(1)
}
