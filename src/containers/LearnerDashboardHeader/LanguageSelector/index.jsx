import React, { useState, useRef, useEffect } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { getLocale, handleRtl } from '@edx/frontend-platform/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';
import './LanguageSelector.scss';

const cookies = new Cookies();

// Danh sách ngôn ngữ được hỗ trợ
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es-419', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'zh-cn', name: '中文 (简体)' },
  { code: 'ar', name: 'العربية' },
  { code: 'ca', name: 'Català' },
  { code: 'he', name: 'עברית' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ko-kr', name: '한국어' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt-br', name: 'Português (Brasil)' },
  { code: 'ru', name: 'Русский' },
  { code: 'th', name: 'ไทย' },
  { code: 'uk', name: 'Українська' },
  { code: 'vi', name: 'Tiếng Việt' },
];

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(getLocale());
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (languageCode) => {
    const config = getConfig();
    const cookieName = config.LANGUAGE_PREFERENCE_COOKIE_NAME || 'openedx-language-preference';
    const sessionCookieDomain = config.SESSION_COOKIE_DOMAIN;
    const cookieDuration = 90 * 24 * 60 * 60; // 90 days in seconds

    // Cài đặt cookie
    const cookieOptions = {
      path: '/',
      maxAge: cookieDuration,
    };

    if (sessionCookieDomain) {
      cookieOptions.domain = sessionCookieDomain;
    }

    cookies.set(cookieName, languageCode, cookieOptions);

    // Cập nhật locale hiện tại
    setCurrentLocale(languageCode);

    // Xử lý RTL
    handleRtl();

    // Đóng dropdown
    setIsOpen(false);

    // Reload trang để áp dụng ngôn ngữ mới
    window.location.reload();
  };

  const getCurrentLanguageName = () => {
    const language = SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLocale);
    return language ? language.name : 'English';
  };

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        type="button"
        className="language-selector-button"
        onClick={toggleDropdown}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <FontAwesomeIcon icon={faGlobe} className="language-icon" />
        <span className="language-current">{getCurrentLanguageName()}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              type="button"
              className={`language-option ${currentLocale === language.code ? 'active' : ''}`}
              onClick={() => selectLanguage(language.code)}
            >
              {language.name}
              {currentLocale === language.code && (
                <span className="checkmark"> ✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
