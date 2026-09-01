'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ProjectLightbox from './ProjectLightbox';

interface GalleryImage {
  id: number;
  media: {
    id: number;
    file: string;
    alt_text: string;
    title: string;
  };
  sort_order: number;
}

interface ProjectGalleryProps {
  images: GalleryImage[];
  projectTitle: string;
}

export default function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const flatImages = images.map((img) => ({
    id: img.media.id,
    file: img.media.file,
    alt_text: img.media.alt_text || projectTitle,
    title: img.media.title || projectTitle,
  }));

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + flatImages.length) % flatImages.length));
  const goNext = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % flatImages.length));

  // Framer Motion staggered grid layout variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <>
      <motion.ul
        role="list"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-5%' }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        aria-label={`Gallery for ${projectTitle}`}
      >
        {flatImages.map((img, idx) => (
          <motion.li key={img.id} variants={itemVariants}>
            <button
              onClick={() => openLightbox(idx)}
              className="group relative w-full aspect-[4/3] overflow-hidden rounded-sm border border-border-color bg-slate-100 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
              aria-label={`View image ${idx + 1}: ${img.alt_text}`}
            >
              <Image
                src={img.file}
                alt={img.alt_text}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300" />
            </button>
          </motion.li>
        ))}
      </motion.ul>

      {lightboxIndex !== null && (
        <ProjectLightbox
          images={flatImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}
