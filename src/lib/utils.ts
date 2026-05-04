import type { ClassValue } from "clsx";

import { QueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createQueryClient() {
  return new QueryClient();
}
