import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const Financing = () => {
  const [loanAmount, setLoanAmount] = useState(5000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(24);
  
  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;
    
    if (monthlyRate === 0) return loanAmount / numPayments;
    
    const monthlyPayment = 
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return monthlyPayment.toFixed(2);
  };
  
  // Calculate total payment
  const calculateTotalPayment = () => {
    return (calculateMonthlyPayment() * loanTerm).toFixed(2);
  };
  
  // Calculate total interest
  const calculateTotalInterest = () => {
    return (calculateTotalPayment() - loanAmount).toFixed(2);
  };

  return (
    <MainLayout>
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Financing Options</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Flexible Payment Solutions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We believe quality healthcare should be accessible to everyone. Explore our financing options designed to fit your budget.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-12">
              <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Healthcare Financing</h3>
                <p className="text-gray-600 mb-6">
                  For procedures and services not covered by insurance, we offer flexible financing options through our trusted partners.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h4 className="text-lg font-semibold text-indigo-600">CareCredit®</h4>
                    <p className="mt-2 text-gray-600">
                      Special financing options for healthcare expenses with convenient monthly payments and promotional financing.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      <li>• No interest if paid in full within 6, 12, or 18 months</li>
                      <li>• Quick application process</li>
                      <li>• Accepted by thousands of providers</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h4 className="text-lg font-semibold text-indigo-600">Vitale Payment Plans</h4>
                    <p className="mt-2 text-gray-600">
                      Our in-house payment plans allow you to spread the cost of your healthcare over time with no credit check required.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      <li>• 0% interest options available</li>
                      <li>• Flexible payment schedules</li>
                      <li>• No impact on credit score</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Finance Calculator</h3>
                <p className="text-gray-600 mb-6">
                  Use our calculator to estimate your monthly payments based on your treatment cost and preferred payment terms.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="loan-amount">Treatment Cost: ${loanAmount}</Label>
                      <div className="mt-2">
                        <Slider 
                          value={[loanAmount]}
                          min={1000}
                          max={25000}
                          step={500}
                          onValueChange={(value) => setLoanAmount(value[0])}
                          className="my-4"
                        />
                        <Input
                          id="loan-amount"
                          type="number"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(Number(e.target.value))}
                          min={1000}
                          max={25000}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="interest-rate">Interest Rate: {interestRate}%</Label>
                      <div className="mt-2">
                        <Slider 
                          value={[interestRate]}
                          min={0}
                          max={15}
                          step={0.25}
                          onValueChange={(value) => setInterestRate(value[0])}
                          className="my-4"
                        />
                        <Input
                          id="interest-rate"
                          type="number"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          min={0}
                          max={15}
                          step={0.25}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="loan-term">Loan Term: {loanTerm} months</Label>
                      <div className="mt-2">
                        <Slider 
                          value={[loanTerm]}
                          min={6}
                          max={60}
                          step={6}
                          onValueChange={(value) => setLoanTerm(value[0])}
                          className="my-4"
                        />
                        <Input
                          id="loan-term"
                          type="number"
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(Number(e.target.value))}
                          min={6}
                          max={60}
                          step={6}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h4 className="text-lg font-semibold text-indigo-600 mb-4">Payment Summary</h4>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="font-medium">Monthly Payment:</span>
                        <span className="text-2xl font-bold">${calculateMonthlyPayment()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Loan Amount:</span>
                        <span>${loanAmount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span>Total Interest:</span>
                        <span>${calculateTotalInterest()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-medium">Total Payment:</span>
                        <span className="font-bold">${calculateTotalPayment()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button className="w-full">Apply for Financing</Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        This is just an estimate. Actual terms may vary based on credit approval.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Insurance Coordination</h3>
                <p className="text-gray-600 mb-6">
                  We work with most major insurance providers to maximize your benefits and minimize out-of-pocket expenses.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                    <p className="font-medium text-gray-800">Blue Cross</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                    <p className="font-medium text-gray-800">Aetna</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                    <p className="font-medium text-gray-800">Cigna</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                    <p className="font-medium text-gray-800">UnitedHealthcare</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900">Need Help with Financing?</h3>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                  Our financial counselors are available to discuss your options and help you find the best solution for your needs.
                </p>
                <div className="mt-8">
                  <Button size="lg">Schedule a Consultation</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Financing;