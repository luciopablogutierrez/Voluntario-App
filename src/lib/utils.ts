import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getContrastColor(hexColor: string) {
  if (!hexColor) return '#000000';
  
  let color = hexColor;
  if (color.slice(0, 1) === '#') {
    color = color.slice(1);
  }

  if (color.length === 3) {
    color = color.split('').map(char => char + char).join('');
  }

  if (color.length !== 6) {
    return '#000000'
  }

  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);

  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
}
