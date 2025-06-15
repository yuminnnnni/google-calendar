export const RepeatType = {
  NONE: "NONE",
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
  WEEKDAYS: "WEEKDAYS",
} as const

export type RepeatType = typeof RepeatType[keyof typeof RepeatType]
