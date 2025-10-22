import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function SocialMediaSettings() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const queryClient = useQueryClient();

  const { data: socialMedia, isLoading } = useQuery({
    queryKey: ['social-media'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/social-media');
      return data;
    },
  });

  const [formData, setFormData] = useState({
    facebook: '',
    instagram: '',
    x: '',
    snapchat: '',
    linkedin: '',
    tiktok: '',
    youtube: '',
  });

  useEffect(() => {
    if (socialMedia) {
      setFormData({
        facebook: socialMedia.facebook || '',
        instagram: socialMedia.instagram || '',
        x: socialMedia.x || '',
        snapchat: socialMedia.snapchat || '',
        linkedin: socialMedia.linkedin || '',
        tiktok: socialMedia.tiktok || '',
        youtube: socialMedia.youtube || '',
      });
    }
  }, [socialMedia]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await axios.put('/api/v1/social-media', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-media'] });
      alert(isArabic ? 'تم حفظ روابط وسائل التواصل الاجتماعي بنجاح' : 'Social media links saved successfully');
    },
    onError: (error) => {
      console.error('Error updating social media:', error);
      alert(isArabic ? 'فشل في حفظ الروابط' : 'Failed to save links');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const platforms = [
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/aqarcity' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/aqarcity' },
    { key: 'x', label: 'X (Twitter)', icon: Twitter, placeholder: 'https://x.com/aqarcity' },
    { 
      key: 'snapchat', 
      label: 'Snapchat', 
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12.5 2c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10zm0 2c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm-1.5 4.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5v5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5v-5zm0 8c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5.672 1.5-1.5 1.5-1.5-.672-1.5-1.5z"/>
        </svg>
      ), 
      placeholder: 'https://snapchat.com/add/aqarcity' 
    },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/company/aqarcity' },
    { 
      key: 'tiktok', 
      label: 'TikTok', 
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ), 
      placeholder: 'https://tiktok.com/@aqarcity' 
    },
    { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@aqarcity' },
  ];

  if (isLoading) {
    return <div className="text-center py-8">{isArabic ? 'جاري التحميل...' : 'Loading...'}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isArabic ? 'روابط وسائل التواصل الاجتماعي' : 'Social Media Links'}
      </h2>
      <p className="text-gray-600 mb-6">
        {isArabic 
          ? 'أضف روابط وسائل التواصل الاجتماعي. سيتم عرض الأيقونات فقط للروابط المضافة.'
          : 'Add social media links. Icons will only appear for links that are provided.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {platforms.map((platform) => (
          <div key={platform.key}>
            <label className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-gray-700 mb-2">
              <platform.icon className="w-5 h-5 text-gray-500" />
              <span>{platform.label}</span>
            </label>
            <input
              type="url"
              value={formData[platform.key as keyof typeof formData]}
              onChange={(e) => setFormData({ ...formData, [platform.key]: e.target.value })}
              placeholder={platform.placeholder}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="btn btn-primary px-6 py-2"
          >
            {updateMutation.isPending
              ? (isArabic ? 'جاري الحفظ...' : 'Saving...')
              : (isArabic ? 'حفظ التغييرات' : 'Save Changes')}
          </button>
        </div>
      </form>
    </div>
  );
}
