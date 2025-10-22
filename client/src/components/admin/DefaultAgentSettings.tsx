import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { UserCheck } from 'lucide-react';

export default function DefaultAgentSettings() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
  });

  const { data: settings } = useQuery({
    queryKey: ['default-agent'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/v1/settings/default-agent');
        return data;
      } catch (error) {
        return { name: '', email: '', phone: '', whatsapp: '' };
      }
    },
    retry: false,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        email: settings.email || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await axios.put('/api/v1/settings/default-agent', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['default-agent'] });
      alert(isArabic ? 'تم حفظ معلومات الوكيل الافتراضي بنجاح' : 'Default agent info saved successfully');
    },
    onError: (error) => {
      console.error('Error updating default agent:', error);
      alert(isArabic ? 'فشل في حفظ المعلومات' : 'Failed to save info');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
        <UserCheck className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          {isArabic ? 'معلومات الوكيل الافتراضي' : 'Default Agent Information'}
        </h2>
      </div>
      <p className="text-gray-600 mb-6">
        {isArabic 
          ? 'هذه المعلومات ستستخدم للعقارات التي لا يوجد لها وكيل محدد'
          : 'This information will be used for properties without a specific agent'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isArabic ? 'الاسم' : 'Name'}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isArabic ? 'البريد الإلكتروني' : 'Email'}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="agent@aqarcity.ae"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isArabic ? 'رقم الهاتف' : 'Phone'}
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+971501234567"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isArabic ? 'واتساب' : 'WhatsApp'}
          </label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            placeholder="+971501234567"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

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
