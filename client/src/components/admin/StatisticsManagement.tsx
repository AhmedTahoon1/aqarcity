import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Edit2, Trash2, Eye, EyeOff, BarChart3 } from 'lucide-react';

interface Statistic {
  id: string;
  number: string;
  titleEn: string;
  titleAr: string;
  icon: string;
  isVisible: boolean;
  displayOrder: number;
}

export default function StatisticsManagement() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    titleEn: '',
    titleAr: '',
    icon: 'BarChart3',
    isVisible: true,
    displayOrder: 0,
  });

  const { data: stats = [] } = useQuery({
    queryKey: ['statistics-all'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/statistics/all');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await axios.post('/api/v1/statistics', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics-all'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      resetForm();
      alert(isArabic ? 'تم الإضافة بنجاح' : 'Added successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const response = await axios.put(`/api/v1/statistics/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics-all'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      resetForm();
      alert(isArabic ? 'تم التحديث بنجاح' : 'Updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/v1/statistics/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics-all'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      alert(isArabic ? 'تم الحذف بنجاح' : 'Deleted successfully');
    },
  });

  const resetForm = () => {
    setFormData({
      number: '',
      titleEn: '',
      titleAr: '',
      icon: 'BarChart3',
      isVisible: true,
      displayOrder: 0,
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (stat: Statistic) => {
    setFormData({
      number: stat.number,
      titleEn: stat.titleEn,
      titleAr: stat.titleAr,
      icon: stat.icon,
      isVisible: stat.isVisible,
      displayOrder: stat.displayOrder,
    });
    setEditingId(stat.id);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const iconOptions = [
    'BarChart3', 'Building2', 'Users', 'Award', 'ThumbsUp', 'TrendingUp', 
    'Home', 'Key', 'MapPin', 'Star', 'CheckCircle', 'Target'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <BarChart3 className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {isArabic ? 'إدارة الإحصائيات' : 'Statistics Management'}
          </h2>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إضافة إحصائية' : 'Add Statistic'}</span>
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? (isArabic ? 'تعديل إحصائية' : 'Edit Statistic') : (isArabic ? 'إضافة إحصائية جديدة' : 'Add New Statistic')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الرقم' : 'Number'}
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="1000+"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الأيقونة' : 'Icon'}
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'العنوان (إنجليزي)' : 'Title (English)'}
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder="Properties Listed"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'العنوان (عربي)' : 'Title (Arabic)'}
              </label>
              <input
                type="text"
                value={formData.titleAr}
                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                placeholder="عقار مدرج"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'ترتيب العرض' : 'Display Order'}
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {isArabic ? 'مرئي' : 'Visible'}
                </span>
              </label>
            </div>
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse mt-4">
            <button type="submit" className="btn btn-primary">
              {isArabic ? 'حفظ' : 'Save'}
            </button>
            <button type="button" onClick={resetForm} className="btn bg-gray-200 text-gray-700">
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-3">
        {stats.map((stat: Statistic) => (
          <div key={stat.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="text-3xl font-bold text-primary-600">{stat.number}</div>
              <div>
                <div className="font-semibold">{isArabic ? stat.titleAr : stat.titleEn}</div>
                <div className="text-sm text-gray-500">Icon: {stat.icon} | Order: {stat.displayOrder}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {stat.isVisible ? (
                <Eye className="w-5 h-5 text-green-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
              <button onClick={() => handleEdit(stat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(isArabic ? 'هل تريد الحذف؟' : 'Delete this statistic?')) {
                    deleteMutation.mutate(stat.id);
                  }
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
