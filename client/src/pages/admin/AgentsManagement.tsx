import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const AgentsManagement: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(null);
  const [propertyAction, setPropertyAction] = useState<'transfer' | 'delete'>('transfer');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/agents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Response not ok:', response.status, response.statusText);
        setAgents([]);
        return;
      }
      
      const text = await response.text();
      if (!text.trim()) {
        console.error('Empty response from server');
        setAgents([]);
        return;
      }
      
      const data = JSON.parse(text);
      setAgents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (agentData: any) => {
    try {
      const url = editingAgent ? `/api/v1/admin/agents/${editingAgent.agent.id}` : '/api/v1/admin/agents';
      const method = editingAgent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(agentData)
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Save failed: ${error.error || error.message}`);
        return;
      }
      
      alert('Agent saved successfully!');
      fetchAgents();
      setShowModal(false);
      setEditingAgent(null);
    } catch (error) {
      console.error('Error saving agent:', error);
      alert('Error saving agent');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    
    try {
      const response = await fetch(`/api/v1/admin/agents/${deleteModal.agent.id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ propertyAction })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Delete failed: ${error.error || error.message}`);
        return;
      }
      
      alert('Agent deleted successfully!');
      fetchAgents();
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Error deleting agent');
    }
  };

  const toggleVisibility = async (agentId: string, visible: boolean) => {
    try {
      const response = await fetch(`/api/v1/admin/agents/${agentId}/visibility`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ visible })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Visibility update failed: ${error.error || error.message}`);
        return;
      }
      
      fetchAgents();
    } catch (error) {
      console.error('Error updating visibility:', error);
      alert('Error updating visibility');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Agents Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Agent
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Array.isArray(agents) && agents.map((agent) => (
                  <tr key={agent.agent.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.agent.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.agent.whatsapp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.agent.companyName || 'Independent'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        agent.agent.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {agent.agent.verified ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleVisibility(agent.agent.id, !agent.agent.verified)}
                          className="text-gray-600 hover:text-blue-600"
                        >
                          {agent.agent.verified ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingAgent(agent);
                            setShowModal(true);
                          }}
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(agent)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <AgentModal
            agent={editingAgent}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingAgent(null);
            }}
          />
        )}

        {/* Delete Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Delete Agent</h3>
              <p className="text-gray-600 mb-4">
                What should happen to this agent's properties?
              </p>
              
              <div className="space-y-2 mb-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="transfer"
                    checked={propertyAction === 'transfer'}
                    onChange={(e) => setPropertyAction(e.target.value as 'transfer')}
                    className="mr-2"
                  />
                  Transfer to default agent
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="delete"
                    checked={propertyAction === 'delete'}
                    onChange={(e) => setPropertyAction(e.target.value as 'delete')}
                    className="mr-2"
                  />
                  Delete all properties
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AgentModal: React.FC<{ agent: any; onSave: (data: any) => void; onClose: () => void }> = ({
  agent,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: agent?.user?.name || '',
    email: agent?.user?.email || '',
    phone: agent?.agent?.phone || '',
    whatsapp: agent?.agent?.whatsapp || '',
    companyName: agent?.agent?.companyName || '',
    bioEn: agent?.agent?.bioEn || '',
    bioAr: agent?.agent?.bioAr || '',
    profileImage: agent?.agent?.profileImage || '',
    languages: agent?.agent?.languages || ['English'],
    officeAddress: agent?.agent?.officeAddress || ''
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {agent ? 'Edit Agent' : 'Add Agent'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp *</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Profile Image URL</label>
              <input
                type="url"
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio (English)</label>
            <textarea
              value={formData.bioEn}
              onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio (Arabic)</label>
            <textarea
              value={formData.bioAr}
              onChange={(e) => setFormData({ ...formData, bioAr: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Languages</label>
            <div className="space-y-2">
              {['English', 'Arabic', 'Hindi', 'Urdu', 'French', 'Russian'].map(lang => (
                <label key={lang} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.languages.includes(lang)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, languages: [...formData.languages, lang] });
                      } else {
                        setFormData({ ...formData, languages: formData.languages.filter(l => l !== lang) });
                      }
                    }}
                    className="mr-2"
                  />
                  {lang}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Office Address</label>
            <textarea
              value={formData.officeAddress || ''}
              onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
              placeholder="Enter office address..."
            />
          </div>



          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentsManagement;