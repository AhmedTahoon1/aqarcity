import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Eye, EyeOff, Home, MapPin, Shield } from 'lucide-react';
import { api } from '@/lib/api';

interface Feature {
  id: string;
  nameEn: string;
  nameAr: string;
  category: 'amenities' | 'location' | 'security';
  level: number;
  displayOrder: number;
  isActive: boolean;
}

export default function Features() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const queryClient = useQueryClient();
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: features, isLoading } = useQuery({
    queryKey: ['admin-features'],
    queryFn: () => api.get('/admin/features').then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/admin/features', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-features'] });
      setShowAddModal(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/admin/features/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-features'] });
      setEditingFeature(null);
    }
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.put(`/admin/features/${id}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-features'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/features/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-features'] });
    }
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'amenities': return <Home className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    const names = {
      amenities: isArabic ? 'المرافق' : 'Amenities',
      location: isArabic ? 'الموقع' : 'Location',
      security: isArabic ? 'الأمان' : 'Security'
    };
    return names[category as keyof typeof names] || category;
  };

  const FeatureModal = ({ feature, onClose }: { feature?: Feature; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      nameEn: feature?.nameEn || '',
      nameAr: feature?.nameAr || '',
      category: feature?.category || 'amenities',
      displayOrder: feature?.displayOrder || 0
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (feature) {
        updateMutation.mutate({ id: feature.id, ...formData });
      } else {
        createMutation.mutate(formData);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {feature ? (isArabic ? 'تعديل الميزة' : 'Edit Feature') : (isArabic ? 'إضافة ميزة' : 'Add Feature')}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {isArabic ? 'الاسم بالإنجليزية' : 'Name (English)'}
              </label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {isArabic ? 'الاسم بالعربية' : 'Name (Arabic)'}
              </label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {isArabic ? 'الفئة' : 'Category'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="amenities">{getCategoryName('amenities')}</option>
                <option value="location">{getCategoryName('location')}</option>
                <option value="security">{getCategoryName('security')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {isArabic ? 'ترتيب العرض' : 'Display Order'}
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            
            <div className="flex space-x-2 rtl:space-x-reverse">
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {isArabic ? 'حفظ' : 'Save'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isArabic ? 'إدارة المميزات' : 'Features Management'}
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إضافة ميزة' : 'Add Feature'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['amenities', 'location', 'security'].map(category => (
          <div key={category} className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b bg-gray-50 flex items-center space-x-2 rtl:space-x-reverse">
              {getCategoryIcon(category)}
              <h2 className="font-semibold">{getCategoryName(category)}</h2>
              <span className="text-sm text-gray-500">
                ({features?.[category]?.length || 0})
              </span>
            </div>
            
            <div className="p-4 space-y-2">
              {features?.[category]?.map((feature: Feature) => (
                <div
                  key={feature.id}
                  className={`p-3 rounded border ${feature.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {isArabic ? feature.nameAr : feature.nameEn}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {isArabic ? feature.nameEn : feature.nameAr}
                      </p>
                    </div>
                    
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <button
                        onClick={() => toggleMutation.mutate(feature.id)}
                        className={`p-1 rounded ${feature.isActive ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}
                        title={feature.isActive ? (isArabic ? 'إيقاف' : 'Disable') : (isArabic ? 'تفعيل' : 'Enable')}
                      >
                        {feature.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => setEditingFeature(feature)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title={isArabic ? 'تعديل' : 'Edit'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm(isArabic ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
                            deleteMutation.mutate(feature.id);
                          }
                        }}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title={isArabic ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <FeatureModal onClose={() => setShowAddModal(false)} />
      )}
      
      {editingFeature && (
        <FeatureModal 
          feature={editingFeature} 
          onClose={() => setEditingFeature(null)} 
        />
      )}
    </div>
  );
}