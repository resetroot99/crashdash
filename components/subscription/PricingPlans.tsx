'use client'

import { useState } from 'react'
import { Check, Zap, Building2, Crown } from 'lucide-react'

interface PricingPlan {
  name: string
  price: number
  interval: string
  description: string
  features: string[]
  popular?: boolean
  stripePriceId: string
  icon: any
}

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    price: 29,
    interval: 'month',
    description: 'Perfect for small independent shops',
    stripePriceId: 'price_starter_monthly', // TODO: Replace with actual Stripe price ID
    icon: Zap,
    features: [
      'Up to 50 jobs per month',
      'Basic profit analysis',
      'CCC XML/CSV import',
      'Email support',
      'Department breakdown'
    ]
  },
  {
    name: 'Professional',
    price: 79,
    interval: 'month',
    description: 'For growing collision repair businesses',
    stripePriceId: 'price_pro_monthly', // TODO: Replace with actual Stripe price ID
    icon: Building2,
    popular: true,
    features: [
      'Up to 200 jobs per month',
      'Advanced profit tracking',
      'Health score alerts',
      'QuickBooks integration',
      'Priority support',
      'Custom margin targets',
      'Historical reporting'
    ]
  },
  {
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    description: 'For multi-location operations',
    stripePriceId: 'price_enterprise_monthly', // TODO: Replace with actual Stripe price ID
    icon: Crown,
    features: [
      'Unlimited jobs',
      'Multi-shop management',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'Advanced analytics',
      'White-label options',
      'Team collaboration'
    ]
  }
]

interface PricingPlansProps {
  onSelectPlan: (planId: string) => void
}

export default function PricingPlans({ onSelectPlan }: PricingPlansProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSelectPlan = async (plan: PricingPlan) => {
    setIsLoading(plan.stripePriceId)
    try {
      await onSelectPlan(plan.stripePriceId)
    } catch (error) {
      console.error('Error selecting plan:', error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get started with profit analysis for your collision repair shop. 
          Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isLoadingPlan = isLoading === plan.stripePriceId

          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.popular
                  ? 'border-primary-500 shadow-xl scale-105'
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <Icon className={`w-12 h-12 mx-auto mb-4 ${
                  plan.popular ? 'text-primary-600' : 'text-gray-600'
                }`} />
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    per {plan.interval}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-success-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={isLoadingPlan}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                } ${isLoadingPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoadingPlan ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Get Started with ${plan.name}`
                )}
              </button>
            </div>
          )
        })}
      </div>

      <div className="text-center mt-8 text-sm text-gray-500">
        <p>All plans include a 14-day free trial. No credit card required to start.</p>
        <p>Cancel anytime. Questions? <a href="mailto:support@crashdash.com" className="text-primary-600 hover:underline">Contact us</a></p>
      </div>
    </div>
  )
} 