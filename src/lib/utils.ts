import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert equation to verbal format for narration
export const equationToVerbal = (equation: string): string => {
  return equation
    .replace(/\s*-\s*/g, ', menos ')
    .replace(/\s*\+\s*/g, ', más ')
    .replace(/\s*=\s*/g, ', es igual a, ') 
    .replace(/\s*\*\s*/g, ', por ')
    .replace(/\s*\/\s*/g, ', dividido por ');
};


