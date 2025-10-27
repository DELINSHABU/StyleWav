'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCollage from '@/components/site/ProductCollage';

interface AboutContent {
  hero: {
    title: string
    subtitle: string
  }
  story: {
    title: string
    paragraphs: string[]
  }
  mission: {
    title: string
    items: {
      title: string
      description: string
    }[]
  }
  stats: {
    title: string
    items: {
      value: string
      label: string
    }[]
  }
  cta: {
    title: string
    subtitle: string
    buttonText: string
  }
}

const defaultContent: AboutContent = {
  hero: {
    title: "StyleWav",
    subtitle: "Where style meets the streets"
  },
  story: {
    title: "Our Story",
    paragraphs: [
      "Born from the streets and crafted for the culture, StyleWav is more than just a clothing brand—it's a movement. We believe that fashion should be accessible, expressive, and bold.",
      "Every piece we create is designed to make a statement, to turn heads, and to give you the confidence to be unapologetically yourself."
    ]
  },
  mission: {
    title: "Our Mission",
    items: [
      {
        title: "Quality First",
        description: "We source premium materials and work with skilled artisans to ensure every piece meets our high standards."
      },
      {
        title: "Sustainable Fashion",
        description: "We're committed to reducing our environmental impact through responsible manufacturing and sustainable practices."
      },
      {
        title: "Community Driven",
        description: "Your feedback shapes our designs. We listen, we adapt, and we create what you want to wear."
      }
    ]
  },
  stats: {
    title: "By The Numbers",
    items: [
      { value: "10K+", label: "Happy Customers" },
      { value: "500+", label: "Unique Designs" },
      { value: "5★", label: "Average Rating" }
    ]
  },
  cta: {
    title: "Join The Wave",
    subtitle: "Be part of something bigger. Shop the latest collection now.",
    buttonText: "Shop Now"
  }
};

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/admin/about');
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        }
      } catch (error) {
        console.error('Error loading about content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-black">
      {/* Hero Section */}
      <section className="flex min-h-screen items-center justify-center px-6 bg-black">
        <div className="max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 text-6xl font-bold text-white md:text-8xl"
          >
            {content.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 md:text-2xl"
          >
            {content.hero.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="flex min-h-screen items-center justify-center px-6 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl"
        >
          <h2 className="mb-8 text-5xl font-bold text-white md:text-7xl">
            {content.story.title}
          </h2>
          <div className="space-y-6 text-lg text-gray-300 md:text-xl">
            {content.story.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Product Collage Section */}
      <ProductCollage />

      {/* Mission Section */}
      <section className="flex min-h-screen items-center justify-center px-6 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl"
        >
          <h2 className="mb-8 text-5xl font-bold text-white md:text-7xl">
            {content.mission.title}
          </h2>
          <div className="space-y-8">
            {content.mission.items.map((item, index) => (
              <div key={index} className="border-l-4 border-white pl-6">
                <h3 className="mb-3 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="text-lg text-gray-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative min-h-screen bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-5xl font-bold text-black md:text-6xl">
            {content.stats.title}
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            {content.stats.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-4 text-6xl font-bold text-black">{item.value}</div>
                <div className="text-xl text-gray-600">{item.label}</div>
              </motion.div>
            ))}
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
              {content.cta.title}
            </h2>
            <p className="mb-10 text-xl text-gray-400">
              {content.cta.subtitle}
            </p>
            <a
              href="/products"
              className="inline-block bg-white px-10 py-4 text-lg font-semibold text-black transition-transform hover:scale-105"
            >
              {content.cta.buttonText}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
