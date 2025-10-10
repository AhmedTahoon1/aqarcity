import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Home, TrendingUp, Info } from 'lucide-react';

export default function MortgageCalculator() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const [propertyPrice, setPropertyPrice] = useState('');
  const [downPayment, setDownPayment] = useState('20');
  const [loanTerm, setLoanTerm] = useState('25');
  const [interestRate, setInterestRate] = useState('3.5');

  const calculateMortgage = () => {
    const price = parseFloat(propertyPrice) || 0;
    const down = (parseFloat(downPayment) / 100) * price;
    const principal = price - down;
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numPayments = parseFloat(loanTerm) * 12;

    if (principal <= 0 || monthlyRate <= 0 || numPayments <= 0) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, downPaymentAmount: down };
    }

    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      totalPayment: totalPayment + down,
      totalInterest,
      downPaymentAmount: down
    };
  };

  const results = calculateMortgage();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('mortgage.title')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('mortgage.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Home className="w-5 h-5 mr-2" />
              {t('mortgage.calculator')}
            </h2>

            <div className="space-y-6">
              {/* Property Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('mortgage.propertyPrice')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="1,000,000"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">AED</span>
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('mortgage.downPayment')} ({downPayment}%)
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5%</span>
                  <span>50%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('mortgage.loanTerm')}
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="15">15 {t('mortgage.years')}</option>
                  <option value="20">20 {t('mortgage.years')}</option>
                  <option value="25">25 {t('mortgage.years')}</option>
                  <option value="30">30 {t('mortgage.years')}</option>
                </select>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('mortgage.interestRate')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              {t('mortgage.results')}
            </h2>

            <div className="space-y-4">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-sm text-primary-600 font-medium">
                  {t('mortgage.monthlyPayment')}
                </div>
                <div className="text-2xl font-bold text-primary-900">
                  {results.monthlyPayment.toLocaleString('en-AE', { 
                    style: 'currency', 
                    currency: 'AED',
                    maximumFractionDigits: 0 
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">
                    {t('mortgage.downPaymentAmount')}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {results.downPaymentAmount.toLocaleString('en-AE', { 
                      style: 'currency', 
                      currency: 'AED',
                      maximumFractionDigits: 0 
                    })}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">
                    {t('mortgage.totalInterest')}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {results.totalInterest.toLocaleString('en-AE', { 
                      style: 'currency', 
                      currency: 'AED',
                      maximumFractionDigits: 0 
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600">
                  {t('mortgage.totalPayment')}
                </div>
                <div className="text-xl font-bold text-blue-900">
                  {results.totalPayment.toLocaleString('en-AE', { 
                    style: 'currency', 
                    currency: 'AED',
                    maximumFractionDigits: 0 
                  })}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  {t('mortgage.disclaimer')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}