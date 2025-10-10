import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { savedSearchesAPI } from '@/lib/api';
import { useAuthContext } from '@/contexts/AuthContext';
import { X, Bookmark } from 'lucide-react';

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchCriteria: any;
}

export default function SaveSearchModal({ isOpen, onClose, searchCriteria }: SaveSearchModalProps) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthContext();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [alertFrequency, setAlertFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');

  const saveSearchMutation = useMutation({
    mutationFn: savedSearchesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] });
      onClose();
      setName('');
      alert('تم حفظ البحث بنجاح!');
    },
    onError: (error: any) => {
      alert('حدث خطأ أثناء حفظ البحث: ' + (error.response?.data?.error || error.message));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveSearchMutation.mutate({
      name: name.trim(),
      searchCriteria,
      alertsEnabled,
      alertFrequency,
    });
  };

  if (!isOpen || !isAuthenticated) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-primary-600" />
            <span>حفظ البحث</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم البحث
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: شقق 3 غرف في دبي"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={alertsEnabled}
                onChange={(e) => setAlertsEnabled(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">تفعيل التنبيهات</span>
            </label>
          </div>

          {alertsEnabled && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تكرار التنبيهات
              </label>
              <select
                value={alertFrequency}
                onChange={(e) => setAlertFrequency(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="instant">فوري</option>
                <option value="daily">يومي</option>
                <option value="weekly">أسبوعي</option>
              </select>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saveSearchMutation.isPending || !name.trim()}
              className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saveSearchMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}