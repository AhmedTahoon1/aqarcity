import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Bell, Send, Image, Home, TrendingDown, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Message {
  id: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  type: 'message' | 'notification';
  category?: 'new_property' | 'price_drop' | 'new_feature' | 'general';
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  replies?: Reply[];
}

interface Reply {
  id: string;
  content: string;
  image?: string;
  isFromAdmin: boolean;
  createdAt: string;
}

export default function Messages() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'new_property' | 'price_drop' | 'new_feature'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyImage, setReplyImage] = useState<File | null>(null);
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      // Mock messages and notifications
      const mockMessages: Message[] = [
        {
          id: '1',
          title: 'Welcome Message',
          titleAr: 'رسالة ترحيب',
          content: 'Welcome to Aqar City UAE! How can we help you today?',
          contentAr: 'مرحباً بك في عقار سيتي الإمارات! كيف يمكننا مساعدتك اليوم؟',
          type: 'message',
          isRead: false,
          createdAt: '2024-01-15T10:00:00Z',
          priority: 'medium',
          replies: []
        },
        {
          id: '2',
          title: 'New Properties Available',
          titleAr: 'عقارات جديدة متاحة',
          content: '15 new luxury apartments added in Dubai Marina',
          contentAr: '15 شقة فاخرة جديدة أضيفت في دبي مارينا',
          type: 'notification',
          category: 'new_property',
          isRead: true,
          createdAt: '2024-01-14T15:30:00Z',
          priority: 'high'
        },
        {
          id: '3',
          title: 'Price Drop Alert',
          titleAr: 'تنبيه انخفاض السعر',
          content: 'Villa in Palm Jumeirah reduced by 500K AED',
          contentAr: 'فيلا في نخلة جميرا انخفض سعرها بـ 500 ألف درهم',
          type: 'notification',
          category: 'price_drop',
          isRead: false,
          createdAt: '2024-01-13T09:15:00Z',
          priority: 'high'
        },
        {
          id: '4',
          title: 'New Feature: Virtual Tours',
          titleAr: 'ميزة جديدة: الجولات الافتراضية',
          content: 'Experience properties with 360° virtual tours',
          contentAr: 'اختبر العقارات مع الجولات الافتراضية 360°',
          type: 'notification',
          category: 'new_feature',
          isRead: false,
          createdAt: '2024-01-12T14:20:00Z',
          priority: 'medium'
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const getIcon = (type: string, category?: string) => {
    if (type === 'message') {
      return <MessageCircle className="w-5 h-5 text-blue-500" />;
    }
    switch (category) {
      case 'new_property': return <Home className="w-5 h-5 text-green-500" />;
      case 'price_drop': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'new_feature': return <Sparkles className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'messages') {
      return msg.type === 'message';
    } else {
      if (msg.type !== 'notification') return false;
      if (notificationFilter === 'all') return true;
      return msg.category === notificationFilter;
    }
  });

  const sendReply = async () => {
    if (!selectedMessage || (!replyText.trim() && !replyImage)) return;
    
    const newReply: Reply = {
      id: Date.now().toString(),
      content: replyText,
      image: replyImage ? URL.createObjectURL(replyImage) : undefined,
      isFromAdmin: false,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => prev.map(msg => 
      msg.id === selectedMessage.id 
        ? { ...msg, replies: [...(msg.replies || []), newReply] }
        : msg
    ));
    
    setReplyText('');
    setReplyImage(null);
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-24"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              {isArabic ? 'الرسائل والإشعارات' : 'Messages & Notifications'}
            </h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 rtl:space-x-reverse mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'messages'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            {isArabic ? 'الرسائل' : 'Messages'}
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            {isArabic ? 'الإشعارات' : 'Notifications'}
          </button>
        </div>

        {/* Notification Filters */}
        {activeTab === 'notifications' && (
          <div className="flex space-x-2 rtl:space-x-reverse mb-6 overflow-x-auto">
            {[
              { key: 'all', icon: Bell, label: isArabic ? 'الكل' : 'All' },
              { key: 'new_property', icon: Home, label: isArabic ? 'عقارات جديدة' : 'New Properties' },
              { key: 'price_drop', icon: TrendingDown, label: isArabic ? 'انخفاض الأسعار' : 'Price Drops' },
              { key: 'new_feature', icon: Sparkles, label: isArabic ? 'ميزات جديدة' : 'New Features' }
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setNotificationFilter(key as any)}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  notificationFilter === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}

        {filteredMessages.length === 0 ? (
          <div className="text-center py-16">
            {activeTab === 'messages' ? (
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            ) : (
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            )}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isArabic 
                ? activeTab === 'messages' ? 'لا توجد رسائل' : 'لا توجد إشعارات'
                : activeTab === 'messages' ? 'No messages' : 'No notifications'
              }
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages/Notifications List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`bg-white rounded-lg p-4 shadow-sm border transition-all hover:shadow-md cursor-pointer ${
                    !message.isRead ? 'border-l-4 border-l-blue-500' : ''
                  } ${
                    selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.isRead) markAsRead(message.id);
                  }}
                >
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    {getIcon(message.type, message.category)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold truncate ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {isArabic ? message.titleAr : message.title}
                        </h3>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse flex-shrink-0">
                          {message.priority === 'high' && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                              {isArabic ? 'عاجل' : 'High'}
                            </span>
                          )}
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {isArabic ? message.contentAr : message.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(message.createdAt).toLocaleDateString(isArabic ? 'ar-AE' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Detail & Reply */}
            <div className="lg:col-span-1">
              {selectedMessage ? (
                <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse mb-4">
                    {getIcon(selectedMessage.type, selectedMessage.category)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {isArabic ? selectedMessage.titleAr : selectedMessage.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {isArabic ? selectedMessage.contentAr : selectedMessage.content}
                      </p>
                    </div>
                  </div>

                  {/* Replies */}
                  {selectedMessage.type === 'message' && (
                    <>
                      <div className="border-t pt-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          {isArabic ? 'المحادثة' : 'Conversation'}
                        </h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {selectedMessage.replies?.map((reply) => (
                            <div key={reply.id} className={`flex ${reply.isFromAdmin ? 'justify-start' : 'justify-end'}`}>
                              <div className={`max-w-xs p-3 rounded-lg ${
                                reply.isFromAdmin 
                                  ? 'bg-gray-100 text-gray-900' 
                                  : 'bg-blue-500 text-white'
                              }`}>
                                {reply.image && (
                                  <img src={reply.image} alt="Reply" className="w-full h-32 object-cover rounded mb-2" />
                                )}
                                <p className="text-sm">{reply.content}</p>
                                <p className={`text-xs mt-1 ${
                                  reply.isFromAdmin ? 'text-gray-500' : 'text-blue-100'
                                }`}>
                                  {new Date(reply.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reply Form */}
                      <div className="border-t pt-4">
                        <div className="space-y-3">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={isArabic ? 'اكتب ردك...' : 'Type your reply...'}
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                          <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer text-gray-600 hover:text-blue-600">
                              <Image className="w-5 h-5" />
                              <span className="text-sm">{isArabic ? 'إرفاق صورة' : 'Attach Image'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setReplyImage(e.target.files?.[0] || null)}
                                className="hidden"
                              />
                            </label>
                            <button
                              onClick={sendReply}
                              disabled={!replyText.trim() && !replyImage}
                              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-4 h-4" />
                              <span>{isArabic ? 'إرسال' : 'Send'}</span>
                            </button>
                          </div>
                          {replyImage && (
                            <div className="relative inline-block">
                              <img src={URL.createObjectURL(replyImage)} alt="Preview" className="w-20 h-20 object-cover rounded" />
                              <button
                                onClick={() => setReplyImage(null)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{isArabic ? 'اختر رسالة لعرضها' : 'Select a message to view'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}