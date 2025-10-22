import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { AgentProfile } from '../components/agents/AgentProfile';
import PropertyCard from '../components/property/PropertyCard';
import { ArrowLeft, Home } from 'lucide-react';

const AgentDetails: React.FC = () => {
  const [match, params] = useRoute('/agents/:id');
  const [agent, setAgent] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchAgentDetails(params.id);
      fetchAgentProperties(params.id);
    }
  }, [params?.id]);

  const fetchAgentDetails = async (agentId: string) => {
    try {
      const response = await fetch(`/api/v1/agents/${agentId}`);
      const data = await response.json();
      setAgent(data);
    } catch (error) {
      console.error('Error fetching agent details:', error);
    }
  };

  const fetchAgentProperties = async (agentId: string) => {
    try {
      const response = await fetch(`/api/v1/agents/${agentId}/properties`);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching agent properties:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent Not Found</h2>
          <p className="text-gray-600">The agent you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Agents
        </button>

        {/* Agent Profile */}
        <AgentProfile
          agent={agent.agent}
          user={agent.user}
          teams={agent.teams}
          metrics={agent.metrics}
        />

        {/* Agent Properties */}
        {properties.length > 0 && (
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Home className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Properties by {agent.user.name}</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {properties.length} Properties
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 6).map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>

              {properties.length > 6 && (
                <div className="text-center mt-6">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    View All Properties ({properties.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDetails;