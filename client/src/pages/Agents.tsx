import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { agentsAPI } from '@/lib/api';
import { AgentCardSkeleton } from '@/components/skeletons';
import { Star, Phone, MessageCircle, MapPin, Award } from 'lucide-react';

export default function Agents() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const { data: agentsData, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => agentsAPI.getAll(),
  });

  const AgentCard = ({ agent, user }: any) => (
    <div className="card p-6">
      <div className="flex items-start space-x-4 rtl:space-x-reverse">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-600">
            {user.name.charAt(0)}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
            {agent.verified && (
              <div className="flex items-center text-green-600">
                <Award className="w-4 h-4 mr-1" />
                <span className="text-sm">Verified</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center mb-3">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">{agent.rating}</span>
            <span className="ml-2 text-sm text-gray-500">
              License: {agent.licenseNumber}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">
            {isArabic ? agent.bioAr : agent.bioEn}
          </p>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Dubai, UAE</span>
            </div>
            <div>Languages: {agent.languages.join(', ')}</div>
          </div>
          
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button className="btn btn-primary flex items-center space-x-2 rtl:space-x-reverse">
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </button>
            <button className="btn btn-secondary flex items-center space-x-2 rtl:space-x-reverse">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('nav.agents')}
          </h1>
          <p className="text-xl text-gray-600">
            Meet our certified real estate professionals
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <AgentCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agentsData?.data?.map((item: any) => (
              <AgentCard
                key={item.agent.id}
                agent={item.agent}
                user={item.user}
              />
            ))}
          </div>
        )}

        {!isLoading && (!agentsData?.data || agentsData.data.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Award className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-600">Please check back later</p>
          </div>
        )}
      </div>
    </div>
  );
}