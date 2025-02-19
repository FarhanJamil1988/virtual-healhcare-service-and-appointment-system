

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$29',
      features: [
        'Up to 50 appointments/month',
        'Email notifications',
        'Calendar integration',
        'Basic analytics',
        '24/7 support'
      ],
      featured: false
    },
    {
      name: 'Professional',
      price: '$79',
      features: [
        'Unlimited appointments',
        'SMS + Email notifications',
        'Advanced analytics',
        'Custom branding',
        'Priority support'
      ],
      featured: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'All Pro features',
        'API access',
        'Custom integration',
        'Dedicated account manager',
        'SLA guarantee'
      ],
      featured: false
    }
  ];

  return (
    <div className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-emerald-400 font-semibold tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Choose the right plan for you
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
            Simple, transparent pricing that grows with your business
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl ${
                plan.featured
                  ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 transform scale-105'
                  : 'bg-gray-800'
              } p-8 shadow-xl`}
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                  <span className="ml-1 text-xl font-semibold text-gray-300">/month</span>
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className={`h-6 w-6 ${plan.featured ? 'text-white' : 'text-emerald-400'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className={`ml-3 ${plan.featured ? 'text-white' : 'text-gray-300'}`}>
                        {feature}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button
                    className={`w-full px-6 py-3 border border-transparent text-base font-medium rounded-md ${
                      plan.featured
                        ? 'text-emerald-700 bg-white hover:bg-gray-50'
                        : 'text-white bg-emerald-500 hover:bg-emerald-600'
                    } transition duration-300`}
                  >
                    Get started
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing; 