export const COOKIE_NAME = "language"
export const language = ["en", "ru"] as const
export const defaultLanguage: Language = "en"

export type Language = (typeof language)[number]
