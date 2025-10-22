import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const { data: socialMedia } = useQuery({
    queryKey: ['social-media'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/social-media');
      return data;
    },
  });

  const footerLinks = {
    company: [
      { href: '/about', label: t('nav.about') },
      { href: '/contact', label: t('nav.contact') },
      { href: '/careers', label: t('nav.careers') },
      { href: '/blog', label: t('footer.blog') },
    ],
    services: [
      { href: '/properties', label: t('nav.properties') },
      { href: '/agents', label: t('nav.agents') },
      { href: '/mortgage-calculator', label: t('footer.mortgage') },
      { href: '/investment', label: t('footer.investment') },
    ],
    legal: [
      { href: '/privacy-policy', label: t('footer.privacy') },
      { href: '/terms-of-service', label: t('footer.terms') },
      { href: '/cookie-policy', label: t('footer.cookies') },
      { href: '/disclaimer', label: t('footer.disclaimer') },
    ]
  };

  const allSocialPlatforms = [
    { icon: Facebook, key: 'facebook', label: 'Facebook' },
    { icon: Instagram, key: 'instagram', label: 'Instagram' },
    { icon: Twitter, key: 'x', label: 'X' },
    { icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12.5 2c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10zm0 2c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm-1.5 4.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5v5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5v-5zm0 8c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5.672 1.5-1.5 1.5-1.5-.672-1.5-1.5z"/>
      </svg>
    ), key: 'snapchat', label: 'Snapchat' },
    { icon: Linkedin, key: 'linkedin', label: 'LinkedIn' },
    { icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ), key: 'tiktok', label: 'TikTok' },
    { icon: Youtube, key: 'youtube', label: 'YouTube' },
  ];

  const socialLinks = allSocialPlatforms.filter(
    (platform) => socialMedia?.[platform.key]
  ).map((platform) => ({
    ...platform,
    href: socialMedia[platform.key],
  }));

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <span className="text-xl font-bold">Aqar City UAE</span>
            </div>
            <p className="text-gray-300 mb-4">
              {t('footer.description')}
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2" />
                <span>+971 4 123 4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@aqarcity.ae</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Dubai Marina, UAE</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.services')}</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 text-sm mb-4 md:mb-0">
            © 2024 Aqar City UAE. {t('footer.rights')}.
          </div>
          
          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}