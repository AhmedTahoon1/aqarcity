import { useState, useEffect } from 'react';
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react';

interface MortgageCalculatorProps {
  propertyPrice: number;
}

export default function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(propertyPrice * 0.8);
  const [downPayment, setDownPayment] = useState(propertyPrice * 0.2);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(25);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateMortgage = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (monthlyRate === 0) {
      setMonthlyPayment(loanAmount / numberOfPayments);
    } else {
      const monthlyPaymentCalc = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      setMonthlyPayment(monthlyPaymentCalc);
    }
  };

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    setLoanAmount(propertyPrice - value);
  };

  const handleLoanAmountChange = (value: number) => {
    setLoanAmount(value);
    setDownPayment(propertyPrice - value);
  };

  return (
    <div className="card p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-3"
      >
        <div className="flex items-center">
          <Calculator className="w-4 h-4 mr-2 text-primary-600" />
          <h3 className="text-base font-semibold">Mortgage Calculator</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isExpanded && (
        <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Price
          </label>
          <div className="text-lg font-semibold text-gray-900">
            AED {propertyPrice.toLocaleString()}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Down Payment (AED)
          </label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="text-xs text-gray-500 mt-1">
            {((downPayment / propertyPrice) * 100).toFixed(1)}% of property price
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount (AED)
          </label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => handleLoanAmountChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term (Years)
          </label>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={15}>15 years</option>
            <option value={20}>20 years</option>
            <option value={25}>25 years</option>
            <option value={30}>30 years</option>
          </select>
        </div>

        <div className="border-t pt-4">
          <div className="bg-primary-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
            <div className="text-2xl font-bold text-primary-600">
              AED {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <div>• Total Interest: AED {((monthlyPayment * loanTerm * 12) - loanAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div>• Total Amount: AED {(monthlyPayment * loanTerm * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        </div>
      )}
    </div>
  );
}