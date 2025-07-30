// Internationalization utilities for LTK website

export type SupportedLanguage = 'ja' | 'en';

export const DEFAULT_LANGUAGE: SupportedLanguage = 'ja';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['ja', 'en'];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  ja: '日本語',
  en: 'English'
};

// Language detection utilities
export function detectLanguageFromPath(pathname: string): SupportedLanguage {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
    return firstSegment as SupportedLanguage;
  }
  
  return DEFAULT_LANGUAGE;
}

export function detectLanguageFromBrowser(): SupportedLanguage {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLangs = navigator.languages || [navigator.language];
  
  for (const lang of browserLangs) {
    const langCode = lang.split('-')[0] as SupportedLanguage;
    if (SUPPORTED_LANGUAGES.includes(langCode)) {
      return langCode;
    }
  }
  
  return DEFAULT_LANGUAGE;
}

export function getLanguageFromUrl(url: string): SupportedLanguage {
  try {
    const urlObj = new URL(url);
    return detectLanguageFromPath(urlObj.pathname);
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

// URL utilities
export function addLanguageToPath(path: string, lang: SupportedLanguage): string {
  if (lang === DEFAULT_LANGUAGE) {
    return path;
  }
  
  // Remove existing language prefix if present
  const cleanPath = removeLanguageFromPath(path);
  return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
}

export function removeLanguageFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
    segments.shift();
  }
  
  return '/' + segments.join('/');
}

export function getLocalizedPath(path: string, currentLang: SupportedLanguage, targetLang: SupportedLanguage): string {
  const cleanPath = removeLanguageFromPath(path);
  return addLanguageToPath(cleanPath, targetLang);
}

// Translation utilities
export interface TranslationFunction {
  (key: string, params?: Record<string, string | number>): string;
}

export function createTranslationFunction(translations: Record<string, any>): TranslationFunction {
  return function t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }
    
    // Replace parameters
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return value;
  };
}

// Date/time formatting utilities
export function formatDate(date: Date | string, lang: SupportedLanguage): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const locale = lang === 'ja' ? 'ja-JP' : 'en-US';
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateTime(date: Date | string, lang: SupportedLanguage): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const locale = lang === 'ja' ? 'ja-JP' : 'en-US';
  
  return dateObj.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatNumber(num: number, lang: SupportedLanguage): string {
  const locale = lang === 'ja' ? 'ja-JP' : 'en-US';
  return num.toLocaleString(locale);
}

// SEO utilities
export function getLanguageAlternates(currentPath: string, currentLang: SupportedLanguage): Array<{ lang: SupportedLanguage; url: string }> {
  const baseUrl = 'https://ltk-sbb.shiai.games';
  const cleanPath = removeLanguageFromPath(currentPath);
  
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang,
    url: `${baseUrl}${addLanguageToPath(cleanPath, lang)}`
  }));
}

export function getHreflangTags(currentPath: string, currentLang: SupportedLanguage): string {
  const alternates = getLanguageAlternates(currentPath, currentLang);
  
  return alternates
    .map(({ lang, url }) => `<link rel="alternate" hreflang="${lang}" href="${url}" />`)
    .join('\n');
}

// Validation utilities
export function isValidLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

export function ensureValidLanguage(lang: string): SupportedLanguage {
  return isValidLanguage(lang) ? lang : DEFAULT_LANGUAGE;
}

// Cookie utilities for language preference
export const LANGUAGE_COOKIE_NAME = 'ltk-language';
export const LANGUAGE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export function getLanguageFromCookie(): SupportedLanguage | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const langCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${LANGUAGE_COOKIE_NAME}=`)
  );
  
  if (langCookie) {
    const lang = langCookie.split('=')[1];
    return isValidLanguage(lang) ? lang : null;
  }
  
  return null;
}

export function setLanguageCookie(lang: SupportedLanguage): void {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${lang}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; SameSite=Lax`;
}

// Language loading utilities
export async function loadTranslations(lang: SupportedLanguage): Promise<Record<string, any>> {
  try {
    // Dynamic import based on language
    const translations = await import(`../locales/${lang}.json`);
    return translations.default || translations;
  } catch (error) {
    console.error(`Failed to load translations for language: ${lang}`, error);
    
    // Fallback to default language if not already loading it
    if (lang !== DEFAULT_LANGUAGE) {
      return loadTranslations(DEFAULT_LANGUAGE);
    }
    
    return {};
  }
}

export type LanguageDirection = 'ltr' | 'rtl';

export function getLanguageDirection(lang: SupportedLanguage): LanguageDirection {
  // Currently all supported languages are LTR
  // Add RTL languages here when needed
  const rtlLanguages: SupportedLanguage[] = [];
  
  return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
}

// URL generation utilities
export function generateLocalizedRoutes(basePath: string): Record<SupportedLanguage, string> {
  const routes: Record<SupportedLanguage, string> = {} as Record<SupportedLanguage, string>;
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    routes[lang] = addLanguageToPath(basePath, lang);
  });
  
  return routes;
}

// Meta tag utilities
export function getLocalizedMeta(
  content: Record<SupportedLanguage, string>,
  lang: SupportedLanguage
): string {
  return content[lang] || content[DEFAULT_LANGUAGE] || '';
}