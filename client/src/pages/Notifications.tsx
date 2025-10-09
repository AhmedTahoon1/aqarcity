import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Home, TrendingDown, Sparkles, Settings, X, ExternalLink, Play, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { notificationsAPI } from '../lib/api';

interface Notification {
  id: string;
  type: 'new_property' | 'price_drop' | 'new_feature' | 'system' | 'marketing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  image?: string;
  videoUrl?: string;
  actionUrl?: string;
  actionTextEn?: string;
  actionTextAr?: string;
  metadata?: {
    propertyId?: string;
    oldPrice?: number;
    newPrice?: number;
    location?: string;
  };
  isRead: boolean;
  createdAt: string;
}

export default function Notifications() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { unreadCount: globalUnreadCount, fetchUnreadCount } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new_property' | 'price_drop' | 'new_feature' | 'system'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      const params = {
        type: filter !== 'all' ? filter : undefined
      };
      const response = await notificationsAPI.getAll(params);
      const sortedNotifications = (response.data.notifications || []).sort(
        (a: Notification, b: Notification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      fetchUnreadCount(); // Update count
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationsAPI.delete(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      fetchUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const openNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowPopup(true);
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_property': return <Home className="w-5 h-5 text-green-500" />;
      case 'price_drop': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'new_feature': return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'system': return <Settings className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const unreadCount = isAuthenticated ? globalUnreadCount : notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Bell className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              {isArabic ? 'الإشعارات' : 'Notifications'}
            </h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {isArabic ? 'تحديد الكل كمقروء' : 'Mark all as read'}
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex space-x-2 rtl:space-x-reverse mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', icon: Bell, label: isArabic ? 'الكل' : 'All' },
            { key: 'new_property', icon: Home, label: isArabic ? 'عقارات جديدة' : 'New Properties' },
            { key: 'price_drop', icon: TrendingDown, label: isArabic ? 'انخفاض الأسعار' : 'Price Drops' },
            { key: 'new_feature', icon: Sparkles, label: isArabic ? 'ميزات جديدة' : 'New Features' },
            { key: 'system', icon: Settings, label: isArabic ? 'النظام' : 'System' }
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === key
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isArabic ? 'لا توجد إشعارات' : 'No notifications'}
            </h3>
            <p className="text-gray-500">
              {isArabic ? 'ستظهر الإشعارات هنا عند توفرها' : 'Notifications will appear here when available'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => openNotification(notification)}
                className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold text-lg ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {isArabic ? notification.titleAr : notification.titleEn}
                      </h3>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                        {!notification.isRead && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {isArabic ? notification.contentAr : notification.contentEn}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        {new Date(notification.createdAt).toLocaleDateString(isArabic ? 'ar-AE' : 'en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {notification.actionUrl && (
                          <span className="text-sm text-blue-600 font-medium">
                            {isArabic ? notification.actionTextAr : notification.actionTextEn} →
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title={isArabic ? 'حذف الإشعار' : 'Delete notification'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {notification.image && (
                    <div className="flex-shrink-0">
                      <img 
                        src={notification.image} 
                        alt="Notification" 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification Popup */}
        {showPopup && selectedNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  {getIcon(selectedNotification.type)}
                  <h2 className="text-xl font-bold text-gray-900">
                    {isArabic ? selectedNotification.titleAr : selectedNotification.titleEn}
                  </h2>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                {selectedNotification.image && (
                  <img 
                    src={selectedNotification.image} 
                    alt="Notification" 
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {isArabic ? selectedNotification.contentAr : selectedNotification.contentEn}
                </p>
                
                {selectedNotification.videoUrl && (
                  <div className="mb-6">
                    <div className="bg-gray-100 rounded-lg p-4 flex items-center space-x-3 rtl:space-x-reverse">
                      <Play className="w-6 h-6 text-red-500" />
                      <div>
                        <p className="font-medium">{isArabic ? 'فيديو توضيحي' : 'Watch Video'}</p>
                        <a 
                          href={selectedNotification.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {selectedNotification.videoUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedNotification.metadata && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {isArabic ? 'تفاصيل إضافية' : 'Additional Details'}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {selectedNotification.metadata.location && (
                        <p>📍 {selectedNotification.metadata.location}</p>
                      )}
                      {selectedNotification.metadata.oldPrice && selectedNotification.metadata.newPrice && (
                        <p>💰 {selectedNotification.metadata.oldPrice.toLocaleString()} → {selectedNotification.metadata.newPrice.toLocaleString()} AED</p>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedNotification.actionUrl && (
                  <div className="flex space-x-3 rtl:space-x-reverse">
                    <a
                      href={selectedNotification.actionUrl}
                      className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                    >
                      <span>{isArabic ? selectedNotification.actionTextAr : selectedNotification.actionTextEn}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}