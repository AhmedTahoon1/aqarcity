import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Heart, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [peopleDropdownOpen, setPeopleDropdownOpen] = useState(false);
  const [infoDropdownOpen, setInfoDropdownOpen] = useState(false);
  const [location] = useLocation();
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setPeopleDropdownOpen(false);
        setInfoDropdownOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setPeopleDropdownOpen(false);
    setInfoDropdownOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const peopleMenuItems = [
    { href: '/agents', label: t('nav.agents') },
    { href: '/developers', label: t('nav.developers') },
  ];

  const infoMenuItems = [
    { href: '/about', label: t('nav.about') },
    { href: '/careers', label: t('nav.careers') },
    { href: '/contact', label: t('nav.contact') },
    { href: '/mortgage-calculator', label: t('mortgage.title') },
  ];

  return (
    <header ref={headerRef} className="glass-effect sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-base">AC</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Aqar City</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link href="/">
              <span className={`text-sm font-medium transition-colors hover:text-primary-600 cursor-pointer ${
                location === '/' ? 'text-primary-600' : 'text-gray-700'
              }`}>
                {t('nav.home')}
              </span>
            </Link>

            <Link href="/properties">
              <span className={`text-sm font-medium transition-colors hover:text-primary-600 cursor-pointer ${
                location === '/properties' ? 'text-primary-600' : 'text-gray-700'
              }`}>
                {t('nav.properties')}
              </span>
            </Link>

            <div className="relative">
              <button 
                onClick={() => {
                  setPeopleDropdownOpen(!peopleDropdownOpen);
                  setInfoDropdownOpen(false);
                  setIsUserMenuOpen(false);
                }}
                className={`flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium transition-colors hover:text-primary-600 cursor-pointer ${
                ['/agents', '/developers'].includes(location) ? 'text-primary-600' : 'text-gray-700'
              }`}>
                <span>{t('nav.people')}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {peopleDropdownOpen && (
                <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  {peopleMenuItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div 
                        onClick={() => setPeopleDropdownOpen(false)}
                        className={`px-4 py-2 text-sm transition-colors hover:bg-primary-50 hover:text-primary-600 cursor-pointer ${
                        location === item.href ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                      }`}>
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => {
                  setInfoDropdownOpen(!infoDropdownOpen);
                  setPeopleDropdownOpen(false);
                  setIsUserMenuOpen(false);
                }}
                className={`flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium transition-colors hover:text-primary-600 cursor-pointer ${
                ['/about', '/careers', '/contact', '/mortgage-calculator'].includes(location) ? 'text-primary-600' : 'text-gray-700'
              }`}>
                <span>{t('nav.info')}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {infoDropdownOpen && (
                <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  {infoMenuItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div 
                        onClick={() => setInfoDropdownOpen(false)}
                        className={`px-4 py-2 text-sm transition-colors hover:bg-primary-50 hover:text-primary-600 cursor-pointer ${
                        location === item.href ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                      }`}>
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <Link href="/favorites">
              <div className="p-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 cursor-pointer transition-all duration-200">
                <Heart className="w-5 h-5" />
              </div>
            </Link>
            
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 cursor-pointer transition-all duration-200"
            >
              <Globe className="w-4 h-4" />
              <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setPeopleDropdownOpen(false);
                    setInfoDropdownOpen(false);
                  }}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.name || t('nav.myAccount')}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link href="/profile">
                      <div 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                        <User className="w-4 h-4" />
                        <span>{t('nav.profile')}</span>
                      </div>
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left rtl:text-right"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200">
                  {t('nav.signIn')}
                </button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/">
                <span className="block text-sm font-medium text-gray-700 hover:text-primary-600 cursor-pointer">
                  {t('nav.home')}
                </span>
              </Link>
              
              <Link href="/properties">
                <span className="block text-sm font-medium text-gray-700 hover:text-primary-600 cursor-pointer">
                  {t('nav.properties')}
                </span>
              </Link>
              
              <Link href="/favorites">
                <span className="block text-sm font-medium text-gray-700 hover:text-primary-600 cursor-pointer">
                  <Heart className="w-4 h-4 inline mr-2" />
                  {t('nav.favorites') || 'المفضلة'}
                </span>
              </Link>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase">
                  {t('nav.people')}
                </div>
                {peopleMenuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span className="block text-sm font-medium text-gray-700 hover:text-primary-600 cursor-pointer pl-4 rtl:pr-4 rtl:pl-0">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase">
                  {t('nav.info')}
                </div>
                {infoMenuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span className="block text-sm font-medium text-gray-700 hover:text-primary-600 cursor-pointer pl-4 rtl:pr-4 rtl:pl-0">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
              
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-700 cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
                </button>
                
                {isAuthenticated ? (
                  <>
                    <Link href="/profile">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-700 cursor-pointer py-2">
                        <User className="w-4 h-4" />
                        <span>{t('nav.profile')}</span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-red-600 cursor-pointer py-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </>
                ) : (
                  <Link href="/login">
                    <div className="text-sm text-primary-600 font-medium cursor-pointer py-2">
                      {t('nav.signIn')}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
