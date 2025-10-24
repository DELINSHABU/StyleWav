'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.05, 0.4], [1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.35, 0.4, 0.75], [0, 1, 1]);
  const opacity3 = useTransform(scrollYProgress, [0.8, 0.95, 1], [0, 1, 1]);

  const scale1 = useTransform(scrollYProgress, [0, 0.05], [1, 1]);
  const scale2 = useTransform(scrollYProgress, [0.35, 0.45], [0.8, 1]);
  const scale3 = useTransform(scrollYProgress, [0.8, 0.95], [0.8, 1]);

  return (
    <div ref={containerRef} className="relative bg-black">
      {/* Hero Section */}
      <motion.section
        style={{ opacity: opacity1, scale: scale1 }}
        className="sticky top-0 flex min-h-screen items-center justify-center px-6"
      >
        <div className="max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 text-6xl font-bold text-white md:text-8xl"
          >
            StyleWav
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 md:text-2xl"
          >
            Where style meets the streets
          </motion.p>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section
        style={{ opacity: opacity2, scale: scale2 }}
        className="sticky top-0 flex min-h-screen items-center justify-center px-6"
      >
        <div className="max-w-4xl">
          <h2 className="mb-8 text-5xl font-bold text-white md:text-7xl">
            Our Story
          </h2>
          <div className="space-y-6 text-lg text-gray-300 md:text-xl">
            <p>
              Born from the streets and crafted for the culture, StyleWav is more than
              just a clothing brand—it's a movement. We believe that fashion should be
              accessible, expressive, and bold.
            </p>
            <p>
              Every piece we create is designed to make a statement, to turn heads,
              and to give you the confidence to be unapologetically yourself.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        style={{ opacity: opacity3, scale: scale3 }}
        className="sticky top-0 flex min-h-screen items-center justify-center px-6"
      >
        <div className="max-w-4xl">
          <h2 className="mb-8 text-5xl font-bold text-white md:text-7xl">
            Our Mission
          </h2>
          <div className="space-y-8">
            <div className="border-l-4 border-white pl-6">
              <h3 className="mb-3 text-2xl font-semibold text-white">Quality First</h3>
              <p className="text-lg text-gray-300">
                We source premium materials and work with skilled artisans to ensure
                every piece meets our high standards.
              </p>
            </div>
            <div className="border-l-4 border-white pl-6">
              <h3 className="mb-3 text-2xl font-semibold text-white">
                Sustainable Fashion
              </h3>
              <p className="text-lg text-gray-300">
                We're committed to reducing our environmental impact through
                responsible manufacturing and sustainable practices.
              </p>
            </div>
            <div className="border-l-4 border-white pl-6">
              <h3 className="mb-3 text-2xl font-semibold text-white">
                Community Driven
              </h3>
              <p className="text-lg text-gray-300">
                Your feedback shapes our designs. We listen, we adapt, and we create
                what you want to wear.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Spacer to extend scroll */}
      <div className="h-screen"></div>
      <div className="h-screen"></div>

      {/* Stats Section */}
      <section className="relative min-h-screen bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-5xl font-bold text-black md:text-6xl">
            By The Numbers
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-4 text-6xl font-bold text-black">10K+</div>
              <div className="text-xl text-gray-600">Happy Customers</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-4 text-6xl font-bold text-black">500+</div>
              <div className="text-xl text-gray-600">Unique Designs</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-4 text-6xl font-bold text-black">5★</div>
              <div className="text-xl text-gray-600">Average Rating</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative min-h-[60vh] bg-black px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-5xl font-bold text-white md:text-6xl">
              Join The Wave
            </h2>
            <p className="mb-10 text-xl text-gray-400">
              Be part of something bigger. Shop the latest collection now.
            </p>
            <a
              href="/products"
              className="inline-block bg-white px-10 py-4 text-lg font-semibold text-black transition-transform hover:scale-105"
            >
              Shop Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
