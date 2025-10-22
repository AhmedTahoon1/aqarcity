import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AgentCard } from '../components/agents/AgentCard';

import { AgentCardSkeleton } from '../components/skeletons';
import { Users, TrendingUp } from 'lucide-react';

const Agents: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/agents');
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAgentClick = (agentId: string) => {
    setLocation(`/agents/${agentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Real Estate Agent
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Connect with verified, experienced agents who know the UAE market inside out
            </p>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">{agents.length}+</div>
                <div className="opacity-75">Verified Agents</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="opacity-75">Areas Covered</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.8</div>
                <div className="opacity-75">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">


        {/* Results Header */}
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold">
              {loading ? 'Loading...' : `${agents.length} Agents Found`}
            </h2>
          </div>
        </div>

        {/* Agents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <AgentCardSkeleton key={index} />
            ))}
          </div>
        ) : agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agentData) => (
              <AgentCard
                key={agentData.agent.id}
                agent={agentData.agent}
                user={agentData.user}
                onClick={() => handleAgentClick(agentData.agent.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No agents found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters to see more results</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              View All Agents
            </button>
          </div>
        )}

        {/* Top Performers Section */}
        {!loading && agents.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold">Top Performing Agents</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agents.slice(0, 3).map((agentData, index) => (
                <div key={agentData.agent.id} className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                    #{index + 1}
                  </div>
                  <h3 className="font-semibold text-lg">{agentData.user.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{agentData.agent.companyName}</p>
                  <div className="text-2xl font-bold text-green-600">{agentData.agent.dealsClosed}</div>
                  <div className="text-sm text-gray-500">Deals Closed</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;