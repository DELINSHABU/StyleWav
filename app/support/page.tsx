'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Headphones, Mail, MessageCircle, Phone, Clock, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupportPage() {
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
            <Headphones className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Customer Support</h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              We're here to help! Get in touch with our support team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">How Can We Help?</h2>
            <p className="text-lg text-muted-foreground">
              Choose the best way to reach us
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Mail,
                title: 'Email Support',
                description: 'support@stylewav.com',
                response: 'Response within 24 hours',
                link: '/contact'
              },
              {
                icon: Phone,
                title: 'Phone Support',
                description: '+1 (555) 123-4567',
                response: 'Mon-Fri: 9 AM - 6 PM EST',
                link: 'tel:+15551234567'
              },
              {
                icon: MessageCircle,
                title: 'Live Chat',
                description: 'Chat with us now',
                response: 'Available 24/7',
                link: '#'
              },
              {
                icon: HelpCircle,
                title: 'Help Center',
                description: 'Browse FAQs',
                response: 'Instant answers',
                link: '#faqs'
              }
            ].map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={option.link}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="p-4 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                        <option.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{option.title}</CardTitle>
                      <CardDescription className="text-base font-semibold text-foreground mt-2">
                        {option.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground">{option.response}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Hours */}
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
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">Support Hours</CardTitle>
                    <CardDescription className="text-base">
                      Our customer support team is available during these hours
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Email & Live Chat</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Available 24/7</p>
                      <p className="text-xs">Email responses within 24 hours</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Phone Support</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Common Topics */}
      <section className="py-16 px-6" id="faqs">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Common Support Topics</h2>
            <p className="text-muted-foreground">Quick answers to frequently asked questions</p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                category: 'Orders & Tracking',
                questions: [
                  'How do I track my order?',
                  'Can I modify my order after placing it?',
                  'What if my order hasn\'t arrived?'
                ]
              },
              {
                category: 'Returns & Refunds',
                questions: [
                  'How do I return an item?',
                  'When will I receive my refund?',
                  'Can I exchange an item?'
                ]
              },
              {
                category: 'Products & Sizing',
                questions: [
                  'How do I find my size?',
                  'Are your products true to size?',
                  'How do I care for my items?'
                ]
              },
              {
                category: 'Account & Payment',
                questions: [
                  'How do I reset my password?',
                  'What payment methods do you accept?',
                  'Is my payment information secure?'
                ]
              }
            ].map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">{topic.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {topic.questions.map((question, qIndex) => (
                        <li key={qIndex} className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                          <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground mb-4">Can't find what you're looking for?</p>
            <Link href="/contact">
              <Button>Contact Support Team</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Helpful Resources</h2>
            <p className="text-muted-foreground">Quick links to important information</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Shipping Info', link: '/shipping', description: 'Delivery times & costs' },
              { title: 'Returns Policy', link: '/returns', description: '30-day return window' },
              { title: 'Contact Us', link: '/contact', description: 'Get in touch' }
            ].map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={resource.link}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
