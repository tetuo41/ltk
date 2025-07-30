// Astro middleware for internationalization
import { defineMiddleware } from 'astro:middleware';
import { 
  detectLanguageFromPath, 
  detectLanguageFromBrowser,
  getLanguageFromCookie,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage
} from './utils/i18n';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request } = context;
  const pathname = url.pathname;
  
  // Skip middleware for static assets
  if (pathname.startsWith('/_astro/') || 
      pathname.startsWith('/favicon.ico') || 
      pathname.startsWith('/robots.txt') ||
      pathname.startsWith('/sitemap.xml') ||
      pathname.includes('.')) {
    return next();
  }

  // Detect current language from URL
  const urlLang = detectLanguageFromPath(pathname);
  
  // Check if we're on a root path without language prefix
  if (pathname === '/' || (pathname.startsWith('/') && !SUPPORTED_LANGUAGES.includes(pathname.split('/')[1] as SupportedLanguage))) {
    
    // Try to detect user's preferred language
    let preferredLang: SupportedLanguage = DEFAULT_LANGUAGE;
    
    // 1. Check cookie first
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const cookies = new Map(
        cookieHeader.split(';').map(cookie => {
          const [key, value] = cookie.trim().split('=');
          return [key, value];
        })
      );
      
      const savedLang = cookies.get('ltk-language');
      if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang as SupportedLanguage)) {
        preferredLang = savedLang as SupportedLanguage;
      }
    }
    
    // 2. Check Accept-Language header if no cookie
    if (preferredLang === DEFAULT_LANGUAGE) {
      const acceptLanguage = request.headers.get('accept-language');
      if (acceptLanguage) {
        const browserLangs = acceptLanguage
          .split(',')
          .map(lang => lang.split(';')[0].split('-')[0])
          .filter(lang => SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage));
        
        if (browserLangs.length > 0) {
          preferredLang = browserLangs[0] as SupportedLanguage;
        }
      }
    }
    
    // Redirect to localized URL if not default language
    if (preferredLang !== DEFAULT_LANGUAGE) {
      const redirectPath = `/${preferredLang}${pathname === '/' ? '' : pathname}`;
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectPath,
          'Cache-Control': 'no-cache'
        }
      });
    }
  }
  
  // Add language context to locals for use in components
  context.locals.lang = urlLang;
  context.locals.langPath = pathname;
  
  return next();
});

// Extend Astro locals type
declare global {
  namespace App {
    interface Locals {
      lang: SupportedLanguage;
      langPath: string;
    }
  }
}