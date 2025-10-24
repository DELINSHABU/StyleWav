'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface SizeChartModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  const sizeChartData = [
    { size: 'XS', chest: '37.8', brandSize: 'XS', length: '27.9' },
    { size: 'S', chest: '40.2', brandSize: 'S', length: '28.8' },
    { size: 'M', chest: '43.3', brandSize: 'M', length: '29.7' },
    { size: 'L', chest: '46.5', brandSize: 'L', length: '30.6' },
    { size: 'XL', chest: '50.4', brandSize: 'XL', length: '31.5' },
    { size: 'XXL', chest: '55.1', brandSize: 'XXL', length: '32.6' },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Size Chart</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Size Chart Table */}
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Size</th>
                    <th className="text-left py-3 px-2 font-medium">Chest</th>
                    <th className="text-left py-3 px-2 font-medium">Brand Size</th>
                    <th className="text-left py-3 px-2 font-medium">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChartData.map((item, index) => (
                    <tr key={item.size} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                      <td className="py-3 px-2 font-medium">{item.size}</td>
                      <td className="py-3 px-2">{item.chest}</td>
                      <td className="py-3 px-2">{item.brandSize}</td>
                      <td className="py-3 px-2">{item.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Measuring Instructions and Diagram */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Measuring T Shirt Size</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Not sure about your t shirt size? Follow these simple steps to figure it out:
              </p>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Shoulder</span> - Measure the shoulder at the back, from edge to edge with arms relaxed on both sides
                </div>
                <div>
                  <span className="font-medium">Chest</span> - Measure around the body under the arms at the fullest part of the chest with your arms relaxed at both sides.
                </div>
                <div>
                  <span className="font-medium">Sleeve</span> - Measure from the shoulder seam through the outer arm to the cuff/hem
                </div>
                <div>
                  <span className="font-medium">Neck</span> - Measured horizontally across the neck Length - Measure from the highest point of the shoulder seam to the bottom hem of the garment's
                </div>
              </div>
            </div>

            {/* T-shirt measurement diagram */}
            <div className="flex justify-center">
              <div className="relative w-48 h-56 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                {/* T-shirt outline */}
                <svg className="w-full h-full" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* T-shirt silhouette */}
                  <path
                    d="M70 40 L70 20 L130 20 L130 40 L160 50 L160 80 L140 80 L140 200 L60 200 L60 80 L40 80 L40 50 L70 40Z"
                    fill="white"
                    stroke="#666"
                    strokeWidth="2"
                  />
                  
                  {/* Measurement lines and labels */}
                  {/* Neck line */}
                  <line x1="70" y1="15" x2="130" y2="15" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2" />
                  <text x="100" y="12" textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="bold">NECK</text>
                  
                  {/* Shoulder line */}
                  <line x1="40" y1="35" x2="160" y2="35" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2" />
                  <text x="100" y="32" textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="bold">SHOULDER</text>
                  
                  {/* Chest line */}
                  <line x1="35" y1="110" x2="165" y2="110" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2" />
                  <text x="20" y="115" textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="bold">CHEST</text>
                  
                  {/* Length line */}
                  <line x1="175" y1="40" x2="175" y2="200" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2" />
                  <text x="185" y="120" textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="bold" transform="rotate(90 185 120)">LENGTH</text>
                  
                  {/* Sleeve line */}
                  <line x1="130" y1="40" x2="160" y2="75" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2" />
                  <text x="155" y="65" textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="bold">SLEEVE</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}