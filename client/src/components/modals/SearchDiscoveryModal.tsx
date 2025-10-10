import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '@/lib/api';
import { X, Search, Calendar, Bell, CheckCircle2 } from 'lucide-react';

interface SearchDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  discoveredSearches: any[];
}

export default function SearchDiscoveryModal({ 
  isOpen, 
  onClose, 
  discoveredSearches 
}: SearchDiscoveryModalProps) {
  const [selectedSearches, setSelectedSearches] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const linkSearchesMutation = useMutation({
    mutationFn: usersAPI.linkSearches,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] });
      alert('تم ربط البحوثات بنجاح! 🎉');
      onClose();
    },
    onError: (error: any) => {
      alert('حدث خطأ: ' + (error.response?.data?.error || error.message));
    },
  });

  const declineSearchesMutation = useMutation({
    mutationFn: usersAPI.declineSearches,
    onSuccess: () => {
      onClose();
    },
  });

  const toggleSelection = (searchId: string) => {
    setSelectedSearches(prev => 
      prev.includes(searchId) 
        ? prev.filter(id => id !== searchId)
        : [...prev, searchId]
    );
  };

  const selectAll = () => {
    setSelectedSearches(discoveredSearches.map(search => search.id));
  };

  const deselectAll = () => {
    setSelectedSearches([]);
  };

  const handleLink = () => {
    if (selectedSearches.length === 0) {
      alert('يرجى اختيار بحث واحد على الأقل');
      return;
    }
    linkSearchesMutation.mutate(selectedSearches);
  };

  const handleDecline = () => {
    const allSearchIds = discoveredSearches.map(search => search.id);
    declineSearchesMutation.mutate(allSearchIds);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">بحوثات محفوظة مكتشفة! 🎉</h3>
              <p className="text-sm text-gray-500">وجدنا {discoveredSearches.length} بحث مرتبط بحسابك</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            هذه البحوثات تم حفظها سابقاً باستخدام نفس الإيميل أو رقم الهاتف المرتبط بحسابك. 
            يمكنك ربطها بحسابك الجديد للاستمرار في تلقي التنبيهات.
          </p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button
              onClick={selectAll}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              اختيار الكل
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={deselectAll}
              className="text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              إلغاء الاختيار
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {selectedSearches.length} من {discoveredSearches.length} محدد
          </span>
        </div>

        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
          {discoveredSearches.map((search) => (
            <div 
              key={search.id} 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedSearches.includes(search.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleSelection(search.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">{search.name}</h4>
                    {selectedSearches.includes(search.id) && (
                      <CheckCircle2 className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(search.createdAt).toLocaleDateString('ar')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bell className={`w-4 h-4 ${search.alertsEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                      <span>
                        {search.alertsEnabled ? `تنبيهات ${search.alertFrequency}` : 'التنبيهات معطلة'}
                      </span>
                    </div>
                  </div>

                  {search.preview && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded px-2 py-1">
                      {search.preview.criteriaPreview}
                    </p>
                  )}
                </div>
                
                <input
                  type="checkbox"
                  checked={selectedSearches.includes(search.id)}
                  onChange={() => toggleSelection(search.id)}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={handleDecline}
            disabled={declineSearchesMutation.isPending}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            {declineSearchesMutation.isPending ? 'جاري الرفض...' : 'لا شكراً'}
          </button>
          <button 
            onClick={handleLink}
            disabled={selectedSearches.length === 0 || linkSearchesMutation.isPending}
            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {linkSearchesMutation.isPending 
              ? 'جاري الربط...' 
              : `ربط البحوثات المحددة (${selectedSearches.length})`
            }
          </button>
        </div>
      </div>
    </div>
  );
}