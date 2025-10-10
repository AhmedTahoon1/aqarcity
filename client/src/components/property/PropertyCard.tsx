import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Heart, MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight, Phone, MessageCircle, GitCompare } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { motion } from 'framer-motion';
import { FavoriteButton } from '../animations';
import { useCompareStore } from '../../stores/compareStore';

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
}

export default function PropertyCard({ property }: PropertyCardProps) {
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
  
  // Auto-advance images every 5 seconds
  useEffect(() => {
    const images = property.images?.length > 0 ? property.images : ['/sample.svg'];
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [property.images]);

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
      <div 
        className="relative group overflow-hidden"
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
          <FavoriteButton 
            isFavorite={favorited}
            onClick={handleFavoriteClick}
          />
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
      </div>

      <div className="p-4">
        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{property.city} - {property.location}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-3 line-clamp-2 leading-tight">
          {(() => {
            const title = (isArabic ? property.titleAr : property.titleEn) || 'Property';
            return title.length > 28 ? title.substring(0, 28) + '...' : title;
          })()}
        </h3>

        {/* Price and Type */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-primary-600">
            {formatPrice(property.price, property.currency)}
          </div>
          <div className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
            {property.propertyType}
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-1 rtl:space-x-reverse group/detail hover:text-primary-600 transition-colors">
            <Bed className="w-4 h-4 text-primary-600 group-hover/detail:scale-110 transition-transform" />
            <span className="font-medium">{property.bedrooms || 'Studio'}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse group/detail hover:text-primary-600 transition-colors">
            <Bath className="w-4 h-4 text-primary-600 group-hover/detail:scale-110 transition-transform" />
            <span className="font-medium">{property.bathrooms}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse group/detail hover:text-primary-600 transition-colors">
            <Square className="w-4 h-4 text-primary-600 group-hover/detail:scale-110 transition-transform" />
            <span className="font-medium">{property.areaSqft?.toLocaleString() || 'N/A'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link href={`/properties/${property.id}`}>
            <motion.button 
              className="w-full btn btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {t('property.viewDetails')}
            </motion.button>
          </Link>
          
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => handleContact('phone')}
              className="flex-1 btn btn-outline flex items-center justify-center space-x-1 rtl:space-x-reverse"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">{isArabic ? 'اتصال' : 'Call'}</span>
            </button>
            <button
              onClick={() => handleContact('whatsapp')}
              className="flex-1 btn btn-outline flex items-center justify-center space-x-1 rtl:space-x-reverse text-green-600 border-green-600 hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{isArabic ? 'واتساب' : 'WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}