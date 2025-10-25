'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReturnsPage() {
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
            <RotateCcw className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Returns & Exchanges</h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Not satisfied? We've got you covered with our hassle-free return policy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Return Window */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-2">30-Day Return Policy</CardTitle>
                <CardDescription className="text-base">
                  You have 30 days from the date of delivery to return your items for a full refund or exchange.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How to Return */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">How to Return an Item</h2>
            <p className="text-muted-foreground">Follow these simple steps to return your purchase</p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Initiate Your Return',
                description: 'Log into your account and go to your order history. Select the order you want to return and click "Request Return".'
              },
              {
                step: '2',
                title: 'Print Return Label',
                description: 'Once approved, you\'ll receive a prepaid return shipping label via email. Print it out and attach it to your package.'
              },
              {
                step: '3',
                title: 'Pack Your Items',
                description: 'Place items in original packaging with tags attached. Include your order receipt or packing slip.'
              },
              {
                step: '4',
                title: 'Ship It Back',
                description: 'Drop off your package at any authorized carrier location. Keep your tracking number for reference.'
              },
              {
                step: '5',
                title: 'Receive Your Refund',
                description: 'Once we receive and inspect your return, we\'ll process your refund within 5-7 business days.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Conditions */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Return Conditions</h2>
            <p className="text-muted-foreground">Items must meet these criteria to be eligible for return</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-green-500/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <CardTitle className="text-xl">Eligible for Return</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Unworn and unwashed items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Original tags attached</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>In original packaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Returned within 30 days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Free from odors or stains</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-red-500/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <XCircle className="h-8 w-8 text-red-500" />
                    <CardTitle className="text-xl">Not Eligible for Return</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Worn or washed items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Items without original tags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Final sale or clearance items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Custom or personalized items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Items returned after 30 days</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Exchanges */}
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
                    <AlertCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">Exchanges</CardTitle>
                    <CardDescription className="text-base">
                      Need a different size or color? We make exchanges easy!
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  To exchange an item, simply return your original purchase following our return process and place a new order for the item you want. This ensures you get your new item as quickly as possible.
                </p>
                <p className="text-sm text-muted-foreground">
                  If the new item is more expensive, you'll pay the difference. If it's less expensive, we'll refund the difference to your original payment method.
                </p>
              </CardContent>
            </Card>
          </motion.div>
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
            <h2 className="text-3xl font-bold mb-6">Need Help with a Return?</h2>
            <p className="text-gray-400 mb-8">
              Our customer support team is ready to assist you with any questions.
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
