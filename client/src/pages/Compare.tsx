import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, GitCompare, X, MapPin, Bed, Bath, Square, Calendar } from 'lucide-react';
import { useCompareStore } from '../stores/compareStore';

export default function Compare() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const { properties, removeProperty, clearAll } = useCompareStore();
  const isArabic = i18n.language === 'ar';

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GitCompare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isArabic ? 'لا توجد عقارات للمقارنة' : 'No Properties to Compare'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isArabic ? 'أضف عقارات من صفحة العقارات لبدء المقارنة' : 'Add properties from the properties page to start comparing'}
          </p>
          <button
            onClick={() => setLocation('/properties')}
            className="btn btn-primary"
          >
            {isArabic ? 'تصفح العقارات' : 'Browse Properties'}
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M AED`;
    }
    return `${price.toLocaleString()} AED`;
  };

  const comparisonRows = [
    { key: 'price', label: isArabic ? 'السعر' : 'Price', format: formatPrice },
    { key: 'propertyType', label: isArabic ? 'نوع العقار' : 'Property Type' },
    { key: 'bedrooms', label: isArabic ? 'غرف النوم' : 'Bedrooms' },
    { key: 'bathrooms', label: isArabic ? 'دورات المياه' : 'Bathrooms' },
    { key: 'area', label: isArabic ? 'المساحة (قدم مربع)' : 'Area (sq ft)', format: (val: number) => val?.toLocaleString() },
    { key: 'city', label: isArabic ? 'المدينة' : 'City' },
    { key: 'status', label: isArabic ? 'الحالة' : 'Status', format: (val: string) => val === 'sale' ? (isArabic ? 'للبيع' : 'For Sale') : (isArabic ? 'للإيجار' : 'For Rent') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setLocation('/properties')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isArabic ? 'مقارنة العقارات' : 'Property Comparison'}
              </h1>
              <p className="text-gray-600">
                {isArabic ? `مقارنة ${properties.length} عقارات` : `Comparing ${properties.length} properties`}
              </p>
            </div>
          </div>
          
          <button
            onClick={clearAll}
            className="btn btn-outline text-red-600 border-red-600 hover:bg-red-50"
          >
            {isArabic ? 'مسح الكل' : 'Clear All'}
          </button>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Property Images Header */}
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4 text-left font-semibold text-gray-900 bg-gray-50 min-w-[150px]">
                    {isArabic ? 'المواصفات' : 'Features'}
                  </th>
                  {properties.map((property) => (
                    <th key={property.id} className="p-4 text-center min-w-[250px]">
                      <div className="relative">
                        <img
                          src={property.images[0] || '/sample.svg'}
                          alt={property.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <button
                          onClick={() => removeProperty(property.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {property.title}
                        </h3>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              {/* Comparison Rows */}
              <tbody>
                {comparisonRows.map((row, index) => (
                  <motion.tr
                    key={row.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium text-gray-900 bg-gray-50">
                      {row.label}
                    </td>
                    {properties.map((property) => (
                      <td key={property.id} className="p-4 text-center">
                        <span className="text-gray-900">
                          {row.format 
                            ? row.format((property as any)[row.key])
                            : (property as any)[row.key] || 'N/A'
                          }
                        </span>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {properties.map((property) => (
            <motion.button
              key={property.id}
              onClick={() => setLocation(`/properties/${property.id}`)}
              className="btn btn-primary flex-1 max-w-xs"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isArabic ? 'عرض تفاصيل' : 'View Details'} - {property.title.substring(0, 20)}...
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}