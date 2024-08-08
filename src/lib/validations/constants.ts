export const event = {
  slug: {
    minLength: 1,
    maxLength: 255,
  },
  shortDescription: {
    minLength: 1,
    maxLength: 255,
  },
  displayName: {
    minLength: 1,
    maxLength: 100,
  },
} as const;

export const question = {
  minLength: 1,
  maxLength: 2500,
} as const;

export const poll = {
  body: {
    minLength: 1,
    maxLength: 500,
  },
  options: {
    minLength: 1,
    maxLength: 100,
    minCount: 2,
    maxCount: 6,
  },
} as const;
