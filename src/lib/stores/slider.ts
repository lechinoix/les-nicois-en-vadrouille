import type { LightGallery } from 'lightgallery/lightgallery';
import { writable } from 'svelte/store';

export const sliderRef = writable<LightGallery | null>(null);
