import { create } from 'zustand';
import { createAuthSlice } from './slices/authslice'; // Correct the import path

export const useAppStore = create((...a) => ({
  ...createAuthSlice(...a),
}));