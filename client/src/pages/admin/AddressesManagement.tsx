import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, MapPin, Building } from 'lucide-react';
import { addressesAPI } from '@/lib/api';
import SearchableSelect from '@/components/ui/SearchableSelect';

interface Address {
  id: string;
  nameEn: string;
  nameAr: string;
  parentId?: string;
  level: number;
  displayOrder: number;
  isActive: boolean;
  path?: string;
}

export default function AddressesManagement() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    parentId: '',
    level: 0,
    displayOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await addressesAPI.getAll();
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await addressesAPI.update(editingAddress.id, formData);
      } else {
        await addressesAPI.create(formData);
      }
      fetchAddresses();
      resetForm();
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Error saving address');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await addressesAPI.delete(id);
      fetchAddresses();
    } catch (error: any) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Error deleting address');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nameEn: '',
      nameAr: '',
      parentId: '',
      level: 0,
      displayOrder: 0,
      isActive: true
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const startEdit = (address: Address) => {
    setFormData({
      nameEn: address.nameEn,
      nameAr: address.nameAr,
      parentId: address.parentId || '',
      level: address.level,
      displayOrder: address.displayOrder,
      isActive: address.isActive
    });
    setEditingAddress(address);
    setShowForm(true);
  };

  const getParentOptions = () => {
    return addresses.filter(addr => addr.level < 2);
  };

  const renderAddressTree = () => {
    const emirates = addresses.filter(addr => addr.level === 0);
    
    return emirates.map(emirate => (
      <div key={emirate.id} className="mb-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">
                {isArabic ? emirate.nameAr : emirate.nameEn}
              </h3>
              <p className="text-sm text-blue-600">Level {emirate.level} • Order: {emirate.displayOrder}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => startEdit(emirate)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(emirate.id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="ml-6 mt-2 space-y-2">
          {addresses
            .filter(addr => addr.parentId === emirate.id)
            .map(area => (
              <div key={area.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <div>
                    <span className="font-medium text-gray-900">
                      {isArabic ? area.nameAr : area.nameEn}
                    </span>
                    <p className="text-sm text-gray-500">Level {area.level} • Order: {area.displayOrder}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(area)}
                    className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(area.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    ));
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Addresses Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Address</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">English Name</label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Arabic Name</label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Parent</label>
                <SearchableSelect
                  value={formData.parentId}
                  onChange={(value) => setFormData({
                    ...formData, 
                    parentId: value,
                    level: value ? (addresses.find(a => a.id === value)?.level === 0 ? 1 : 2) : 0
                  })}
                  placeholder="None (No Parent)"
                  options={[
                    { value: '', label: 'None (No Parent)' },
                    ...addresses
                      .filter(addr => addr.level === 0)
                      .map(emirate => ({
                        value: emirate.id,
                        label: isArabic ? emirate.nameAr : emirate.nameEn,
                        group: 'Emirates'
                      })),
                    ...addresses
                      .filter(addr => addr.level === 1)
                      .map(area => ({
                        value: area.id,
                        label: isArabic ? area.nameAr : area.nameEn,
                        group: 'Areas'
                      }))
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({...formData, displayOrder: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm">Active</label>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  {editingAddress ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {renderAddressTree()}
      </div>
    </div>
  );
}