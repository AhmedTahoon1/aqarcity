import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, GitCompare, X, MapPin, Bed, Bath, Square, Calendar, Download, Printer } from 'lucide-react';
import { useCompareStore } from '../stores/compareStore';

export default function Compare() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const { properties, removeProperty, clearAll } = useCompareStore();
  const isArabic = i18n.language === 'ar';
  
  // Limit to maximum 4 properties for better PDF layout
  const limitedProperties = properties.slice(0, 4);

  const handlePrint = () => {
    const printContent = document.getElementById('comparison-table');
    const originalContent = document.body.innerHTML;
    
    const printStyles = `
      <style>
        @media print {
          body { font-family: Arial, sans-serif; margin: 20px; }
          .print-header { text-align: center; margin-bottom: 30px; }
          .print-header h1 { color: #1f2937; font-size: 24px; margin-bottom: 10px; }
          .print-header p { color: #6b7280; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
          th { background-color: #f9fafb; font-weight: bold; }
          .property-image { width: 100px; height: 60px; object-fit: cover; }
          .no-print { display: none !important; }
        }
      </style>
    `;
    
    const baseUrl = window.location.origin;
    const printHTML = printContent?.innerHTML.replace(
      /class="property-link"/g,
      'style="color: #1f2937; text-decoration: underline; font-size: 12px;"'
    );
    
    document.body.innerHTML = printStyles + `
      <div class="print-header">
        <h1>${isArabic ? 'مقارنة العقارات - عقار سيتي الإمارات' : 'Property Comparison - Aqar City UAE'}</h1>
        <p>${isArabic ? `مقارنة ${properties.length} عقارات` : `Comparing ${properties.length} properties`}</p>
        <p>${new Date().toLocaleDateString(isArabic ? 'ar-AE' : 'en-US')}</p>
      </div>
    ` + printHTML;
    
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleDownloadPDF = () => {
    // Simple PDF generation using browser print to PDF
    const printContent = document.getElementById('comparison-table');
    const newWindow = window.open('', '_blank');
    
    const pdfStyles = `
      <style>
        @page { 
          size: A4 landscape; 
          margin: 0.5in; 
        }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          padding: 15px;
          background: white;
          color: #1a202c;
          font-size: 12px;
        }
        .pdf-header { 
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 0;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 25px;
        }
        .logo-section {
          display: flex;
          align-items: center;
        }
        .logo-link {
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        .logo {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
          margin-right: 12px;
        }
        .site-info h1 { 
          font-size: 20px; 
          margin: 0;
          color: #2d3748;
          font-weight: 600;
        }
        .site-info p { 
          font-size: 12px; 
          color: #718096;
          margin: 2px 0 0 0;
        }
        .date-info {
          text-align: right;
          color: #718096;
          font-size: 11px;
        }
        .properties-grid {
          display: grid;
          grid-template-columns: repeat(${Math.min(properties.length, 4)}, 1fr);
          gap: 20px;
          margin-bottom: 25px;
        }
        .property-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          background: white;
        }
        .property-image { 
          width: 100%; 
          height: 120px; 
          object-fit: cover;
        }
        .property-content {
          padding: 12px;
        }
        .property-title { 
          font-weight: 600; 
          color: #2d3748;
          font-size: 13px;
          line-height: 1.3;
          margin-bottom: 8px;
          height: 32px;
          overflow: hidden;
        }
        .property-price {
          font-weight: 700;
          color: #38a169;
          font-size: 14px;
          margin-bottom: 6px;
        }
        .property-details {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #718096;
          margin-bottom: 8px;
        }
        .property-link {
          color: #3182ce;
          font-size: 10px;
          text-decoration: underline;
          cursor: pointer;
        }
        .property-link:hover {
          color: #2c5aa0;
        }
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .comparison-table th {
          background: #f7fafc;
          padding: 8px;
          text-align: left;
          font-weight: 600;
          font-size: 11px;
          border: 1px solid #e2e8f0;
        }
        .comparison-table td {
          padding: 8px;
          font-size: 10px;
          border: 1px solid #e2e8f0;
          text-align: center;
        }
      </style>
    `;
    
    const baseUrl = window.location.origin;
    const pdfHTML = printContent?.innerHTML.replace(
      /class="property-link"/g,
      'style="color: #1f2937; text-decoration: underline; font-size: 12px;"'
    );
    
    newWindow?.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${isArabic ? 'مقارنة العقارات' : 'Property Comparison'}</title>
        <meta charset="UTF-8">
        ${pdfStyles}
      </head>
      <body>
        <div class="pdf-header">
          <div class="logo-section">
            <a href="${baseUrl}" class="logo-link" target="_blank">
              <div class="logo">AC</div>
              <div class="site-info">
                <h1>${isArabic ? 'عقار سيتي الإمارات' : 'Aqar City UAE'}</h1>
                <p>${isArabic ? 'مقارنة العقارات' : 'Property Comparison'}</p>
              </div>
            </a>
          </div>
          <div class="date-info">
            <p>${new Date().toLocaleDateString(isArabic ? 'ar-AE' : 'en-US')}</p>
            <p>${isArabic ? `${properties.length} عقارات` : `${properties.length} Properties`}</p>
          </div>
        </div>
        
        <div class="properties-grid">
          ${properties.map(property => `
            <div class="property-card">
              <img src="${property.images[0] || '/sample.svg'}" alt="${property.title}" class="property-image">
              <div class="property-content">
                <div class="property-title">${property.title}</div>
                <div class="property-price">${formatPrice(property.price)} AED</div>
                <div class="property-details">
                  <span>${property.bedrooms || 0} ${isArabic ? 'غرف' : 'Beds'}</span>
                  <span>${property.bathrooms || 0} ${isArabic ? 'حمام' : 'Baths'}</span>
                  <span>${property.area?.toLocaleString() || 'N/A'} sqft</span>
                </div>
                <a href="${baseUrl}/properties/${property.id}" class="property-link" target="_blank">
                  ${isArabic ? 'صفحة العقار' : 'Property Page'}
                </a>
              </div>
            </div>
          `).join('')}
        </div>
        
        <table class="comparison-table">
          <thead>
            <tr>
              <th>${isArabic ? 'المواصفات' : 'Features'}</th>
              ${properties.map(property => `<th>${property.title.substring(0, 25)}...</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${comparisonRows.filter(row => row.key !== 'link').map(row => `
              <tr>
                <td style="font-weight: 600; background: #f7fafc;">${row.label}</td>
                ${properties.map(property => `
                  <td>${row.format ? row.format((property as any)[row.key]) : (property as any)[row.key] || 'N/A'}</td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);
    
    newWindow?.document.close();
    setTimeout(() => {
      newWindow?.print();
    }, 500);
  };

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
    { key: 'link', label: isArabic ? 'الرابط' : 'Link', isLink: true },
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
          
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button
              onClick={handlePrint}
              className="btn btn-outline flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Printer className="w-4 h-4" />
              <span>{isArabic ? 'طباعة' : 'Print'}</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="btn btn-primary flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Download className="w-4 h-4" />
              <span>{isArabic ? 'تحميل PDF' : 'Download PDF'}</span>
            </button>
            <button
              onClick={clearAll}
              className="btn btn-outline text-red-600 border-red-600 hover:bg-red-50"
            >
              {isArabic ? 'مسح الكل' : 'Clear All'}
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div id="comparison-table" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                        <h3 className="property-title font-semibold text-sm line-clamp-2">
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
                    <td className="feature-label p-4 font-medium text-gray-900 bg-gray-50">
                      {row.label}
                    </td>
                    {properties.map((property) => (
                      <td key={property.id} className="p-4 text-center">
                        {row.isLink ? (
                          <span className="property-link text-xs">
                            {window.location.origin}/properties/{property.id}
                          </span>
                        ) : (
                          <span className={`text-gray-900 ${row.key === 'price' ? 'price-cell' : ''}`}>
                            {row.format 
                              ? row.format((property as any)[row.key])
                              : (property as any)[row.key] || 'N/A'
                            }
                          </span>
                        )}
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