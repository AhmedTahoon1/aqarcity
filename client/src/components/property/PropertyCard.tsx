import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Heart, MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight, Phone, MessageCircle, GitCompare } from 'lucide-react';

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);
import { useFavorites } from '../../hooks/useFavorites';
import { motion } from 'framer-motion';
import { FavoriteButton } from '../animations';
import { useCompareStore } from '../../stores/compareStore';
import PropertyFeatures from './PropertyFeatures';

interface Property {
  id: string;
  referenceNumber?: string;
  titleEn: string;
  titleAr: string;
  location: string;
  city: string;
  price: string;
  currency: string;
  status: 'sale' | 'rent';
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  images: string[];
  features?: {
    amenities: string[];
    location: string[];
    security: string[];
  };
  isFeatured: boolean;
  completionStatus?: 'completed' | 'under_construction';
  handoverStatus?: 'ready' | 'future';
  handoverDate?: string;
  masterPlanImage?: string;
  paymentPlans?: {type: string; description: string; monthlyPayment?: string; years?: number}[];
  propertyDescription?: string;
  agent?: {
    id: string;
    phone?: string;
    whatsapp?: string;
  };
}

interface PropertyCardProps {
  property: Property;
  hideFavoriteButton?: boolean;
}

export default function PropertyCard({ property, hideFavoriteButton = false }: PropertyCardProps) {
  const { t, i18n } = useTranslation();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { addProperty, removeProperty, isInCompare, canAdd } = useCompareStore();
  const isArabic = i18n.language === 'ar';
  const favorited = isFavorite(property.id);
  const inCompare = isInCompare(property.id);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorited) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites({
        id: property.id,
        title: property.titleEn,
        titleAr: property.titleAr,
        location: property.location,
        price: parseFloat(property.price),
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.areaSqft,
        images: property.images || ['/sample.svg'],
        type: property.propertyType
      });
    }
  };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Removed auto-advance images

  const formatPrice = (price: string, currency: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(1)}M ${currency}`;
    }
    return `${numPrice.toLocaleString()} ${currency}`;
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const images = property.images?.length > 0 ? property.images : ['/sample.svg'];
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const images = property.images?.length > 0 ? property.images : ['/sample.svg'];
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (index !== currentImageIndex) {
      setIsImageLoading(true);
      setCurrentImageIndex(index);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return;
    
    const images = property.images?.length > 0 ? property.images : ['/sample.svg'];
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      nextImage(e as any);
    }
    if (isRightSwipe && images.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      prevImage(e as any);
    }
  };

  const getStatusText = (status: string) => {
    return status === 'sale' ? (isArabic ? 'للبيع' : 'For Sale') : (isArabic ? 'للإيجار' : 'For Rent');
  };

  const getStatusColor = (status: string) => {
    return status === 'sale' ? 'bg-green-600' : 'bg-blue-600';
  };

  const handleContact = (type: 'phone' | 'whatsapp') => {
    const defaultPhone = '+971501234567';
    const defaultWhatsapp = '+971501234567';
    
    if (type === 'phone') {
      const phone = property.agent?.phone || defaultPhone;
      window.open(`tel:${phone}`);
    } else if (type === 'whatsapp') {
      const whatsapp = property.agent?.whatsapp || defaultWhatsapp;
      const title = (isArabic ? property.titleAr : property.titleEn) || 'Property';
      const message = encodeURIComponent(`مرحباً، أنا مهتم بالعقار: ${title}`);
      window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${message}`);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCompare) {
      removeProperty(property.id);
    } else if (canAdd()) {
      addProperty({
        id: property.id,
        title: (isArabic ? property.titleAr : property.titleEn) || 'Property',
        price: parseFloat(property.price),
        city: property.city,
        propertyType: property.propertyType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.areaSqft,
        images: property.images || ['/sample.svg'],
        status: property.status
      });
    }
  };

  return (
    <motion.div 
      className="card overflow-hidden"
      whileHover={{ 
        y: -8,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Link href={`/properties/${property.id}`}>
        <div 
          className="relative group overflow-hidden cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
        {/* Main Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200 select-none">
          {/* Loading Skeleton */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          <img
            src={(property.images?.length > 0 ? property.images : ['/sample.svg'])[currentImageIndex]}
            alt={`${(isArabic ? property.titleAr : property.titleEn) || 'Property'} - Image ${currentImageIndex + 1}`}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
            onError={(e) => {
              e.currentTarget.src = '/sample.svg';
              setIsImageLoading(false);
            }}
          />
          
          {/* Image Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Image Navigation */}
        {(property.images?.length > 0 ? property.images : ['/sample.svg']).length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            {/* Image Counter */}
            <div className="absolute top-3 right-16 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              {currentImageIndex + 1} / {(property.images?.length > 0 ? property.images : ['/sample.svg']).length}
            </div>
            
            {/* Simple Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
              {(() => {
                const images = property.images?.length > 0 ? property.images : ['/sample.svg'];
                return images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => goToImage(index, e)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    style={{ marginLeft: '2px', marginRight: '2px' }}
                  />
                ));
              })()}
            </div>
          </>
        )}
        
        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {/* Status Badge */}
          <div className={`${getStatusColor(property.status)} text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm`}>
            {getStatusText(property.status)}
          </div>
          
          {/* Featured Badge */}
          {property.isFeatured && (
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              ⭐ {isArabic ? 'مميز' : 'Featured'}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          {!hideFavoriteButton && (
            <FavoriteButton 
              isFavorite={favorited}
              onClick={handleFavoriteClick}
            />
          )}
          {!hideFavoriteButton && (
            <motion.button
              onClick={handleCompareClick}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                inCompare 
                  ? 'bg-primary-600 text-white shadow-lg' 
                  : 'bg-white/90 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              } ${!canAdd() && !inCompare ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={canAdd() || inCompare ? { scale: 1.1 } : {}}
              whileTap={canAdd() || inCompare ? { scale: 0.9 } : {}}
              disabled={!canAdd() && !inCompare}
              title={inCompare ? (isArabic ? 'إزالة من المقارنة' : 'Remove from compare') : (isArabic ? 'إضافة للمقارنة' : 'Add to compare')}
            >
              <GitCompare className="w-4 h-4" />
            </motion.button>
          )}
        </div>
        
        {/* Compare Button for Favorites Page */}
        {hideFavoriteButton && (
          <div className="absolute bottom-3 right-3">
            <motion.button
              onClick={handleCompareClick}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                inCompare 
                  ? 'bg-primary-600 text-white shadow-lg' 
                  : 'bg-white/90 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              } ${!canAdd() && !inCompare ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={canAdd() || inCompare ? { scale: 1.1 } : {}}
              whileTap={canAdd() || inCompare ? { scale: 0.9 } : {}}
              disabled={!canAdd() && !inCompare}
              title={inCompare ? (isArabic ? 'إزالة من المقارنة' : 'Remove from compare') : (isArabic ? 'إضافة للمقارنة' : 'Add to compare')}
            >
              <GitCompare className="w-4 h-4" />
            </motion.button>
          </div>
        )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        {/* Section 2: Location + Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{property.city} - {property.location}</span>
          </div>
          <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
            {property.propertyType}
          </span>
        </div>

        {/* Section 3: Title - Clickable */}
        <Link href={`/properties/${property.id}`}>
          <h3 className="font-semibold text-lg truncate leading-tight hover:text-primary-600 transition-colors cursor-pointer">
            {(isArabic ? property.titleAr : property.titleEn) || 'Property'}
          </h3>
        </Link>

        {/* Section 4: Specs */}
        <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Bed className="w-4 h-4 text-primary-600" />
            <span className="font-medium">{property.bedrooms || 'Studio'}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Bath className="w-4 h-4 text-primary-600" />
            <span className="font-medium">{property.bathrooms}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Square className="w-4 h-4 text-primary-600" />
            <span className="font-medium">{property.areaSqft?.toLocaleString() || 'N/A'}</span>
          </div>
        </div>

        {/* Section 5: Features */}
        {property.features && (
          <div>
            <PropertyFeatures features={property.features} compact={true} />
          </div>
        )}

        {/* Section 6: Price + Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-xl font-bold text-primary-600">
            {formatPrice(property.price, property.currency)}
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => handleContact('phone')}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              title={isArabic ? 'اتصال' : 'Call'}
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleContact('whatsapp')}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              title={isArabic ? 'واتساب' : 'WhatsApp'}
            >
              <WhatsAppIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}