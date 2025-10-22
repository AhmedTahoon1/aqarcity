import React from 'react';
import { Star, MapPin, Phone, MessageCircle, Award, Users, Clock, TrendingUp } from 'lucide-react';

interface AgentProfileProps {
  agent: any;
  user: any;
  teams?: any[];
  metrics?: any[];
}

export const AgentProfile: React.FC<AgentProfileProps> = ({ agent, user, teams, metrics }) => {
  if (!agent || !user) {
    return <div className="text-center py-12">Loading...</div>;
  }


  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg">
        <div className="flex items-start gap-6">
          {agent?.profileImage ? (
            <img 
              src={agent.profileImage} 
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-3xl"
            style={{ display: agent?.profileImage ? 'none' : 'flex' }}
          >
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{user?.name || 'Agent'}</h1>
            <p className="text-xl opacity-90 mb-2">{agent?.companyName || 'Independent Agent'}</p>
            <div className="flex items-center gap-4 mb-4">
              {agent?.verified && (
                <div className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
                  ✓ Verified Agent
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {agent?.languages?.map((lang: string, index: number) => (
                <span key={index} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{agent?.propertiesCount || 0}</div>
            <div className="text-gray-600">Properties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{agent?.dealsClosed || 0}</div>
            <div className="text-gray-600">Deals Closed</div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed">
            {agent.bioEn || `Experienced real estate professional with ${agent.experienceYears} years in the UAE market.`}
          </p>
        </div>



        {/* Teams */}
        {teams && teams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Teams
            </h2>
            <div className="space-y-3">
              {teams.map((team: any, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">{team.team.name}</h3>
                  <p className="text-gray-600 text-sm">{team.team.description}</p>
                  <span className="inline-block mt-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {team.role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* Contact Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-2">Phone</p>
              <p className="font-medium">{agent.phone || user.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Email</p>
              <p className="font-medium">{agent.email || user.email}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600 mb-2">Office Address</p>
              <p className="font-medium">{agent.officeAddress || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Call Now
            </button>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};