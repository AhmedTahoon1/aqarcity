import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';

interface Job {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  requirements: string[];
  location: string;
  salary: string;
  jobType: string;
  status: 'active' | 'closed';
}

export default function JobsManagement() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    requirements: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    status: 'active' as 'active' | 'closed',
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs-admin'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/careers');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/v1/careers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs-admin'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      resetForm();
      alert(isArabic ? 'تم الإضافة بنجاح' : 'Added successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(`/api/v1/careers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs-admin'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      resetForm();
      alert(isArabic ? 'تم التحديث بنجاح' : 'Updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/v1/careers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs-admin'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      alert(isArabic ? 'تم الحذف بنجاح' : 'Deleted successfully');
    },
  });

  const resetForm = () => {
    setFormData({
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
      requirements: '',
      location: '',
      salary: '',
      jobType: 'Full-time',
      status: 'active',
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (job: Job) => {
    setFormData({
      titleEn: job.titleEn,
      titleAr: job.titleAr,
      descriptionEn: job.descriptionEn,
      descriptionAr: job.descriptionAr,
      requirements: job.requirements.join('\n'),
      location: job.location,
      salary: job.salary || '',
      jobType: job.jobType,
      status: job.status,
    });
    setEditingId(job.id);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Briefcase className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {isArabic ? 'إدارة الوظائف' : 'Jobs Management'}
          </h2>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إضافة وظيفة' : 'Add Job'}</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? (isArabic ? 'تعديل وظيفة' : 'Edit Job') : (isArabic ? 'إضافة وظيفة جديدة' : 'Add New Job')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'العنوان (إنجليزي)' : 'Title (English)'}
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
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
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الوصف (إنجليزي)' : 'Description (English)'}
              </label>
              <textarea
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الوصف (عربي)' : 'Description (Arabic)'}
              </label>
              <textarea
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'المتطلبات (سطر لكل متطلب)' : 'Requirements (one per line)'}
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={4}
                placeholder="RERA License&#10;2+ years experience&#10;English & Arabic fluency"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الموقع' : 'Location'}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الراتب' : 'Salary'}
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="8,000 - 15,000 AED"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'نوع الوظيفة' : 'Job Type'}
              </label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الحالة' : 'Status'}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'closed' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">{isArabic ? 'نشط' : 'Active'}</option>
                <option value="closed">{isArabic ? 'مغلق' : 'Closed'}</option>
              </select>
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

      <div className="space-y-3">
        {jobs.map((job: Job) => (
          <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <h3 className="font-semibold text-lg">{isArabic ? job.titleAr : job.titleEn}</h3>
                <span className={`px-2 py-1 text-xs rounded ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {job.status === 'active' ? (isArabic ? 'نشط' : 'Active') : (isArabic ? 'مغلق' : 'Closed')}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {job.location} • {job.jobType} {job.salary && `• ${job.salary}`}
              </div>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button onClick={() => handleEdit(job)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(isArabic ? 'هل تريد الحذف؟' : 'Delete this job?')) {
                    deleteMutation.mutate(job.id);
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
