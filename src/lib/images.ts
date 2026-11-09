import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

import summitFlag from '../assets/objects/obj-summit-flag.png';
import compass from '../assets/objects/obj-compass.png';
import notebookPen from '../assets/objects/obj-notebook-pen.png';
import coffeeCups from '../assets/objects/obj-coffee-cups.png';
import steppingStones from '../assets/objects/obj-stepping-stones.png';
import paperPlane from '../assets/objects/obj-paper-plane.png';
import speechBubbles from '../assets/objects/obj-speech-bubbles.png';
import ladder from '../assets/objects/obj-ladder.png';
import calendar30 from '../assets/objects/obj-calendar-30.png';

export const objects = {
  'summit-flag': summitFlag,
  compass,
  'notebook-pen': notebookPen,
  'coffee-cups': coffeeCups,
  'stepping-stones': steppingStones,
  'paper-plane': paperPlane,
  'speech-bubbles': speechBubbles,
  ladder,
  'calendar-30': calendar30,
} as const;

export type ObjectName = keyof typeof objects;

export type ObjSrc = { webp: string; png: string; width: number; height: number };

/** WebP + PNG fallback for an object render, max 480px wide. For React islands. */
export async function objSrc(name: ObjectName, width = 480): Promise<ObjSrc> {
  const img = objects[name];
  const w = Math.min(width, 480);
  const [webp, png] = await Promise.all([
    getImage({ src: img, width: w, format: 'webp', quality: 82 }),
    getImage({ src: img, width: w, format: 'png' }),
  ]);
  return { webp: webp.src, png: png.src, width: webp.attributes.width ?? w, height: webp.attributes.height ?? w };
}

export type PhotoSrc = { src: string; srcset: string; width: number; height: number; alt: string };

/** A responsive photo for a React island. */
export async function photoSrc(img: ImageMetadata, alt: string, widths: number[]): Promise<PhotoSrc> {
  const out = await getImage({ src: img, widths, format: 'webp', quality: 80 });
  return {
    src: out.src,
    srcset: out.srcSet.attribute,
    width: out.attributes.width ?? img.width,
    height: out.attributes.height ?? img.height,
    alt,
  };
}
