export const SRS_INTERVALS = {
  1: 4, // Apprentice I (lesson completed or failed review) -> 4 hours
  2: 8, // Apprentice II -> 8 hours
  3: 24, // Apprentice III -> 1 day
  4: 72, // Guru I -> 3 days
  5: 168, // Guru II -> 1 week
  6: 336, // Master I -> 2 weeks
  7: 720, // Master II -> 1 month
  8: 2160, // Enlightened -> 3 months
  9: null, // Burned -> never review again
} as const;
