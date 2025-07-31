export const categoryTranslations = {
  birthday_greeting: 'Birthday Greeting',
  welcome_greeting: 'Welcome Greeting',
  work_anniversary_greeting: 'Work Anniversary Greeting',
  new_year_holiday_greeting: 'New Year Holiday Greeting',
  company_anniversary_greeting: 'Company Anniversary Greeting',
  general: 'General',
} as const;

export const languageTranslations = {
  english: 'English',
  german: 'German',
  ukrainian: 'Ukrainian',
} as const;

export type CardCategory = keyof typeof categoryTranslations;
export type CardLanguage = keyof typeof languageTranslations;
