import React from 'react';
import { Star, MapPin, Phone, MessageCircle } from 'lucide-react';

interface AgentCardProps {
  agent: any;
  user: any;
  onClick?: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, user, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {agent.profileImage ? (
            <img 
              src={agent.profileImage} 
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ display: agent.profileImage ? 'none' : 'flex' }}
          >
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{agent.companyName || 'Independent Agent'}</p>
    
          </div>
          {agent.verified && (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Verified
            </div>
          )}
        </div>



        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">{agent.propertiesCount || 0}</div>
            <div className="text-xs text-gray-500">Properties</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{agent.dealsClosed || 0}</div>
            <div className="text-xs text-gray-500">Deals Closed</div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.open(`tel:${agent.phone || user.phone || '+971501234567'}`);
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Call
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const phone = agent.whatsapp || agent.phone || user.phone || '+971501234567';
              const message = encodeURIComponent(`Hello, I would like to inquire about your real estate services.`);
              window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`);
            }}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};