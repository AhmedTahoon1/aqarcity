import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Phone, Mail } from 'lucide-react';

const VerifyAgent: React.FC = () => {
  const [searchType, setSearchType] = useState<'phone' | 'email'>('phone');
  const [phoneValue, setPhoneValue] = useState('+971 ');
  const [emailValue, setEmailValue] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const searchValue = searchType === 'phone' ? phoneValue : emailValue;
    if (!searchValue.trim() || (searchType === 'phone' && searchValue.trim() === '+971')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/agents/verify?${searchType}=${encodeURIComponent(searchValue)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error verifying agent:', error);
      setResult({ found: false, error: 'Search failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Agent</h1>
            <p className="text-gray-600">Check if an agent is affiliated with our company</p>
          </div>

          <div className="space-y-6">
            {/* Search Type Selection */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSearchType('phone')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  searchType === 'phone' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Phone className="w-4 h-4" />
                رقم الهاتف / Phone Number
              </button>
              <button
                onClick={() => setSearchType('email')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  searchType === 'email' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Mail className="w-4 h-4" />
                البريد الإلكتروني / Email
              </button>
            </div>

            {/* Search Input */}
            <div className="flex gap-2">
              {searchType === 'phone' ? (
                <input
                  type="tel"
                  value={phoneValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith('+971 ') || value === '+971') {
                      setPhoneValue(value);
                    } else if (value.length < 5) {
                      setPhoneValue('+971 ');
                    }
                  }}
                  placeholder="+971 50 123 4567"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="ltr"
                />
              ) : (
                <input
                  type="email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  placeholder="agent@example.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="ltr"
                />
              )}
              <button
                onClick={handleSearch}
                disabled={loading || (searchType === 'phone' ? phoneValue.trim() === '+971' : !emailValue.trim())}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                بحث / Search
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="mt-8 p-6 rounded-lg border">
                {result.found ? (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Agent Verified ✓</h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900">{result.agent.user.name}</p>
                      <p className="text-gray-600">{result.agent.agent.companyName || 'Independent Agent'}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        License: {result.agent.agent.licenseNumber || 'N/A'}
                      </p>
                      {result.agent.agent.verified && (
                        <span className="inline-block mt-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Verified Agent
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-800 mb-2">Agent Not Found</h3>
                    <p className="text-gray-600">
                      No agent found with this {searchType}. Please verify the information and try again.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAgent;