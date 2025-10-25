'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, Clock, DollarSign, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 text-white hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Package className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Shipping Information</h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Fast, reliable shipping to get your StyleWav gear to you quickly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Shipping Options</h2>
            <p className="text-lg text-muted-foreground">
              Choose the shipping method that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Truck,
                title: 'Standard Shipping',
                time: '5-7 Business Days',
                cost: '$5.99',
                description: 'Reliable and affordable shipping for most orders'
              },
              {
                icon: Clock,
                title: 'Express Shipping',
                time: '2-3 Business Days',
                cost: '$12.99',
                description: 'Faster delivery when you need it soon'
              },
              {
                icon: DollarSign,
                title: 'Free Shipping',
                time: '5-7 Business Days',
                cost: 'Orders over $75',
                description: 'Enjoy free standard shipping on qualifying orders'
              }
            ].map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                      <option.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{option.title}</CardTitle>
                    <CardDescription className="text-lg font-semibold text-foreground mt-2">
                      {option.cost}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium mb-2">{option.time}</p>
                    <p className="text-muted-foreground">{option.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">International Shipping</CardTitle>
                    <CardDescription className="text-base">
                      We ship worldwide! International shipping times and costs vary by destination.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Delivery Times:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Canada: 7-10 business days</li>
                    <li>Europe: 10-15 business days</li>
                    <li>Asia: 12-18 business days</li>
                    <li>Australia/New Zealand: 10-14 business days</li>
                    <li>Rest of World: 15-25 business days</li>
                  </ul>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> International orders may be subject to customs duties and taxes.
                    These fees are the responsibility of the customer and are not included in our shipping costs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Shipping Policy */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Shipping Policy</h2>
            <p className="text-muted-foreground">Everything you need to know about our shipping process</p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                title: 'Processing Time',
                content: 'Orders are processed within 1-2 business days (Monday-Friday, excluding holidays). Orders placed on weekends will be processed on the next business day.'
              },
              {
                title: 'Order Tracking',
                content: 'Once your order ships, you\'ll receive a confirmation email with tracking information. You can track your package using the provided tracking number or through your account dashboard.'
              },
              {
                title: 'Shipping Address',
                content: 'Please ensure your shipping address is correct before completing your order. We are not responsible for orders shipped to incorrect addresses provided by the customer.'
              },
              {
                title: 'Delivery Delays',
                content: 'While we strive to meet delivery estimates, delays may occur due to weather, carrier issues, or other unforeseen circumstances. We appreciate your patience and understanding.'
              },
              {
                title: 'P.O. Boxes',
                content: 'We can ship to P.O. Boxes using USPS standard shipping. Express shipping is not available for P.O. Box addresses.'
              },
              {
                title: 'Lost or Stolen Packages',
                content: 'If your tracking shows delivered but you haven\'t received your package, please contact us within 48 hours. We\'ll work with the carrier to resolve the issue.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.content}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-black text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Have Questions About Shipping?</h2>
            <p className="text-gray-400 mb-8">
              Our support team is here to help with any shipping inquiries.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-200">
                Contact Support
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
