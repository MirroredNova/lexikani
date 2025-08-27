export const SRS_INTERVALS = {
  0: 4, // Apprentice 1 -> 4 hours
  1: 8, // Apprentice 2 -> 8 hours
  2: 24, // Apprentice 3 -> 1 day
  3: 72, // Apprentice 4 -> 3 days
  4: 168, // Guru 1 -> 1 week
  5: 336, // Guru 2 -> 2 weeks
  6: 720, // Master -> 1 month
  7: 2160, // Enlightened -> 3 months
  8: null, // Burned -> never review again
} as const;
