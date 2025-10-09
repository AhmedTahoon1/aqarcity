import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, X } from 'lucide-react';
import { useCompareStore } from '../../stores/compareStore';

export default function CompareBar() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const { properties, removeProperty, clearAll } = useCompareStore();
  const isArabic = i18n.language === 'ar';

  if (properties.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-primary-100 p-2 rounded-lg">
                <GitCompare className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isArabic ? 'مقارنة العقارات' : 'Property Comparison'}
                </h3>
                <p className="text-sm text-gray-600">
                  {properties.length} {isArabic ? 'عقار محدد' : 'properties selected'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={clearAll}
                className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                title={isArabic ? 'مسح الكل' : 'Clear all'}
              >
                <X className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setLocation('/compare')}
                disabled={properties.length < 2}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isArabic ? 'مقارنة الآن' : 'Compare Now'}
              </button>
            </div>
          </div>
          
          {/* Property Thumbnails */}
          <div className="flex space-x-2 rtl:space-x-reverse mt-3 overflow-x-auto">
            {properties.map((property) => (
              <div key={property.id} className="relative flex-shrink-0">
                <img
                  src={property.images[0] || '/sample.svg'}
                  alt={property.title}
                  className="w-16 h-12 object-cover rounded border"
                />
                <button
                  onClick={() => removeProperty(property.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}