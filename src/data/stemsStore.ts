import { StemOption } from "@/types";
import { STEM_OPTIONS } from "./products";

declare global {
  // eslint-disable-next-line no-var
  var __annaStems: StemOption[] | undefined;
}

export function getStoredStems(): StemOption[] {
  if (!global.__annaStems) {
    global.__annaStems = [...STEM_OPTIONS];
  }
  return global.__annaStems;
}

export function addStoredStem(stem: StemOption): StemOption {
  const stems = getStoredStems();
  stems.unshift(stem);
  return stem;
}

export function deleteStoredStem(id: string): boolean {
  const stems = getStoredStems();
  const index = stems.findIndex((s) => s.id === id);
  if (index !== -1) {
    stems.splice(index, 1);
    return true;
  }
  return false;
}
