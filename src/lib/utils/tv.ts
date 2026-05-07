import { createTV, type TVReturnType } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

export type { VariantProps, TVReturnType } from "tailwind-variants";

export type TVClassValue = Parameters<typeof twMerge>[0];

export const tv = createTV({
  twMerge: true,
});
