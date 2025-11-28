import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert equation to verbal format for narration
export const equationToVerbal = (equation: string): string => {
  return equation
    // Las comas (,) fuerzan al narrador a hacer una pequeña pausa
    .replace(/\s*-\s*/g, ', menos ')
    .replace(/\s*\+\s*/g, ', más ')
    // "es igual a" da más tiempo al usuario para procesar que solo "igual"
    .replace(/\s*=\s*/g, ', es igual a, ') 
    .replace(/\s*\*\s*/g, ', por ')
    .replace(/\s*\/\s*/g, ', dividido por ');
};


