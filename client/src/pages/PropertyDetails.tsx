import { useState } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { propertiesAPI } from '../lib/api';
import { PropertyDetailsSkeleton } from '../components/skeletons';
import { MapPin, Bed, Bath, Square, Calendar, Heart, Phone, MessageCircle, Share2, ChevronDown, ChevronUp, Hash, CheckCircle, Clock, Image, CreditCard } from 'lucide-react';
import ImageSlider from '../components/property/ImageSlider';
import YouTubeVideo from '../components/property/YouTubeVideo';
import MortgageCalculator from '../components/property/MortgageCalculator';
import InquiryForm from '../components/property/InquiryForm';
import PropertyCard from '../components/property/PropertyCard';

export default function PropertyDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [showMasterPlan, setShowMasterPlan] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Collapsible components
  const CollapsibleAgentCard = ({ agent, isArabic }: { agent: any; isArabic: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    
    const handleCall = () => {
      if (agent.phone) {
        window.open(`tel:${agent.phone}`);
      }
    };
    
    const handleWhatsApp = () => {
      if (agent.whatsapp) {
        const message = encodeURIComponent(
          isArabic 
            ? `مرحباً، أنا مهتم بالعقار: ${property.titleAr}` 
            : `Hello, I'm interested in the property: ${property.titleEn}`
        );
        window.open(`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`);
      }
    };
    
    return (
      <div className="card p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="text-base font-semibold">{isArabic ? 'تواصل مع الوكيل' : 'Contact Agent'}</h3>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isExpanded && (
          <>
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-sm font-bold text-primary-600">
                  {agent.userId ? 'A' : 'AG'}
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold">{isArabic ? 'وكيل عقاري' : 'Real Estate Agent'}</div>
                <div className="text-xs text-gray-500">
                  {isArabic ? 'رخصة:' : 'License:'} {agent.licenseNumber || 'N/A'}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {agent.phone && (
                <button 
                  onClick={handleCall}
                  className="btn btn-primary w-full flex items-center justify-center space-x-2 rtl:space-x-reverse py-2 text-sm"
                >
                  <Phone className="w-3 h-3" />
                  <span>{isArabic ? 'اتصال' : 'Call Agent'}</span>
                </button>
              )}
              {agent.whatsapp && (
                <button 
                  onClick={handleWhatsApp}
                  className="btn btn-secondary w-full flex items-center justify-center space-x-2 rtl:space-x-reverse py-2 text-sm"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>{isArabic ? 'واتساب' : 'WhatsApp'}</span>
                </button>
              )}
              {agent.email && (
                <a 
                  href={`mailto:${agent.email}`}
                  className="btn btn-outline w-full flex items-center justify-center space-x-2 rtl:space-x-reverse py-2 text-sm"
                >
                  <span>📧</span>
                  <span>{isArabic ? 'بريد إلكتروني' : 'Email'}</span>
                </a>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const CollapsibleInquiryForm = ({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    return (
      <div className="card p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="text-base font-semibold">Send Inquiry</h3>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isExpanded && (
          <InquiryForm propertyId={propertyId} propertyTitle={propertyTitle} />
        )}
      </div>
    );
  };

  const CollapsibleDeveloperCard = ({ developer, isArabic }: { developer: any; isArabic: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    return (
      <div className="card p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="text-base font-semibold">Developer</h3>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isExpanded && (
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold text-gray-600">
                {(isArabic ? developer.nameAr : developer.nameEn).charAt(0)}
              </span>
            </div>
            <h4 className="text-sm font-semibold mb-1">
              {isArabic ? developer.nameAr : developer.nameEn}
            </h4>
            <p className="text-xs text-gray-600 mb-2">
              {developer.projectsCount} Projects
            </p>
            {developer.website && (
              <a
                href={developer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-xs"
              >
                Visit Website
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  const { data: propertyData, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesAPI.getById(id!),
    enabled: !!id,
  });

  const property = propertyData?.data?.property;

  const { data: similarProperties, isError: similarPropertiesError } = useQuery({
    queryKey: ['similar-properties', property?.city, property?.propertyType, id],
    queryFn: () => propertiesAPI.getAll({
      city: property?.city,
      type: property?.propertyType,
      limit: 6
    }),
    enabled: !!property,
    retry: 1,
  });

  if (isLoading) {
    return <PropertyDetailsSkeleton />;
  }

  if (!propertyData?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const { agent, developer } = propertyData.data;

  const formatPrice = (price: string, currency: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(1)}M ${currency}`;
    }
    return `${numPrice.toLocaleString()} ${currency}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative">
        <ImageSlider 
          images={property.images} 
          title={isArabic ? property.titleAr : property.titleEn}
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        {property.isFeatured && (
          <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Hash className="w-4 h-4 mr-1" />
                  <span>Ref: {property.referenceNumber || 'AC-001'}</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {isArabic ? property.titleAr : property.titleEn}
              </h1>

              <div className="flex items-center justify-between mb-6">
                <div className="text-3xl font-bold text-primary-600">
                  {formatPrice(property.price, property.currency)}
                  {property.status === 'rent' && <span className="text-lg text-gray-500">/year</span>}
                </div>
                <div className="text-sm text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded-full">
                  For {property.status}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">{property.bedrooms || 0}</div>
                  <div className="text-sm text-gray-500">{t('property.bedrooms')}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-gray-500">{t('property.bathrooms')}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Square className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">{property.areaSqft}</div>
                  <div className="text-sm text-gray-500">sqft</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">{property.yearBuilt}</div>
                  <div className="text-sm text-gray-500">Built</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">{new Date(property.createdAt).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">{isArabic ? 'تاريخ الإضافة' : 'Listed Date'}</div>
                </div>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-900">
                      {isArabic ? 'حالة الإنهاء' : 'Completion Status'}
                    </span>
                  </div>
                  <p className="text-blue-700">
                    {property.completionStatus === 'completed' 
                      ? (isArabic ? 'منتهي' : 'Completed')
                      : (isArabic ? 'غير منتهي' : 'Under Construction')
                    }
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-900">
                      {isArabic ? 'حالة التسليم' : 'Handover Status'}
                    </span>
                  </div>
                  <p className="text-green-700">
                    {property.handoverStatus === 'ready'
                      ? (isArabic ? 'تسليم فوري' : 'Ready Now')
                      : (property.handoverDate || (isArabic ? 'تسليم مستقبلي' : 'Future Handover'))
                    }
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => setShowMasterPlan(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Image className="w-4 h-4" />
                  <span>{isArabic ? 'مخطط المشروع' : 'Master Plan'}</span>
                </button>
                <button 
                  onClick={() => setShowMap(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{isArabic ? 'عرض الخريطة' : 'View Map'}</span>
                </button>
              </div>

              {/* Payment Plans */}
              {property.paymentPlans && property.paymentPlans.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    {isArabic ? 'خطط الدفع' : 'Payment Plans'}
                  </h2>
                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ${property.paymentPlans.filter((plan: any) => plan.type !== 'cash').length > 6 ? 'max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' : ''}`}>
                    {property.paymentPlans.filter((plan: any) => plan.type !== 'cash').map((plan: any, index: number) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold mb-2">{plan.description}</h3>
                        {plan.monthlyPayment && (
                          <p className="text-sm text-gray-600">
                            {isArabic ? 'قسط شهري:' : 'Monthly:'} {plan.monthlyPayment}
                          </p>
                        )}
                        {plan.years && (
                          <p className="text-sm text-gray-600">
                            {isArabic ? 'مدة:' : 'Duration:'} {plan.years} {isArabic ? 'سنوات' : 'years'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{isArabic ? 'وصف العقار' : 'Description'}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.propertyDescription || (isArabic ? property.descriptionAr : property.descriptionEn)}
                </p>
              </div>

              {property.features && property.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">{t('property.features')}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {property.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* YouTube Video */}
            <YouTubeVideo 
              videoUrl={property.videoUrl} 
              title={isArabic ? property.titleAr : property.titleEn}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Agent Card */}
              {agent && (
                <CollapsibleAgentCard agent={agent} isArabic={isArabic} />
              )}


              {/* Inquiry Form */}
              <CollapsibleInquiryForm 
                propertyId={property.id}
                propertyTitle={isArabic ? property.titleAr : property.titleEn}
              />

              {/* Mortgage Calculator */}
              <MortgageCalculator propertyPrice={parseFloat(property.price)} />

              {/* Developer Card */}
              {developer && (
                <CollapsibleDeveloperCard developer={developer} isArabic={isArabic} />
              )}

            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {property && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('property.similarProperties')}
            </h2>
            
            {similarPropertiesError && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  {isArabic ? 'تعذر تحميل العقارات المشابهة' : 'Unable to load similar properties'}
                </p>
              </div>
            )}
            
            {!similarPropertiesError && similarProperties?.data?.properties && similarProperties.data.properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarProperties.data.properties
                  .filter((item: any) => item.property.id !== property.id)
                  .slice(0, 6)
                  .map((item: any) => (
                    <PropertyCard
                      key={item.property.id}
                      property={item.property}
                    />
                  ))
                }
              </div>
            ) : !similarPropertiesError && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  {isArabic ? 'لا توجد عقارات مشابهة' : 'No similar properties found'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Master Plan Modal */}
      {showMasterPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {isArabic ? 'مخطط المشروع' : 'Master Plan'}
              </h3>
              <button onClick={() => setShowMasterPlan(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>
            <div className="p-4">
              <img 
                src={property.masterPlanImage || '/sample.svg'} 
                alt="Master Plan" 
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {isArabic ? 'موقع العقار' : 'Property Location'}
              </h3>
              <button onClick={() => setShowMap(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    {isArabic ? 'خريطة تفاعلية - قريباً' : 'Interactive Map - Coming Soon'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {property.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}