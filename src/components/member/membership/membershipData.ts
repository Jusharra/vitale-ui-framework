
// Membership tiers data
export const membershipTiers = [
  {
    id: "smart",
    name: "Smart Access",
    price: "$497",
    interval: "month",
    yearlyPrice: "$5,964",
    description: "Basic healthcare access and digital tools",
    features: [
      "Basic healthcare access",
      "Digital health assessment",
      "Symptom checker tool",
      "Medication tracking",
      "Basic rewards program"
    ],
    notIncluded: [
      "Priority appointment scheduling",
      "Specialist referral coordination",
      "Medical concierge services",
      "24/7 provider access"
    ]
  },
  {
    id: "core",
    name: "Core Concierge",
    price: "$997",
    interval: "month",
    yearlyPrice: "$10,764",
    description: "Enhanced care coordination and priority access",
    features: [
      "Everything in Smart Access",
      "Priority appointment scheduling",
      "Specialist referral coordination",
      "Prescription delivery service",
      "Advanced health monitoring tools",
      "Enhanced rewards program"
    ],
    notIncluded: [
      "24/7 dedicated concierge",
      "Travel medical support",
      "Executive health services"
    ],
    popular: true
  },
  {
    id: "vip",
    name: "VIP Executive",
    price: "$1,297",
    interval: "month",
    yearlyPrice: "$15,564",
    description: "Premium healthcare experience with concierge services",
    features: [
      "Everything in Core Concierge",
      "24/7 dedicated healthcare concierge",
      "Same-day appointments guaranteed",
      "Executive health assessments",
      "Global travel medical support",
      "Premium wellness services",
      "VIP membership perks"
    ],
    notIncluded: []
  }
];
