import {
  ArrowRight,
  BarChart3,
  Check,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import styles from "./landing-page.module.css";

export default function LandingPage() {
  const { data: session } = useSession();

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description:
        "Experience blazing fast performance with our optimized infrastructure.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description:
        "Bank-level security with end-to-end encryption and compliance.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team in real-time collaboration.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Get deep insights with our powerful analytics dashboard.",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individuals and small teams",
      features: [
        "Up to 1,000 API calls",
        "Basic analytics",
        "Email support",
        "Standard integrations",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 10,000 API calls",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "Team management",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations",
      features: [
        "Unlimited API calls",
        "Custom analytics",
        "24/7 phone support",
        "Custom integrations",
        "Advanced security",
        "Dedicated account manager",
      ],
      popular: false,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Transform Your Business with{" "}
              <span className={styles.heroTitleHighlight}>Our Platform</span>
            </h1>
            <p className={styles.heroDescription}>
              Streamline your workflow, boost productivity, and scale your
              business with our comprehensive SaaS solution. Join thousands of
              companies already using our platform.
            </p>
            <div className={styles.heroButtons}>
              {!session ? (
                <button className={styles.primaryButton}>
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button className={styles.primaryButton}>
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              <button className={styles.secondaryButton}>Watch Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresSubtitle}>Everything you need</h2>
            <p className={styles.featuresTitle}>
              Powerful features to grow your business
            </p>
            <p className={styles.featuresDescription}>
              Our platform provides all the tools you need to succeed in today's
              competitive market.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            <dl className={styles.featuresList}>
              {features.map((feature) => (
                <div key={feature.title} className={styles.featureItem}>
                  <dt className={styles.featureHeader}>
                    <div className={styles.featureIcon}>{feature.icon}</div>
                    {feature.title}
                  </dt>
                  <dd className={styles.featureDescription}>
                    <p>{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricingSection}>
        <div className={styles.pricingContainer}>
          <div className={styles.pricingHeader}>
            <h2 className={styles.pricingTitle}>Simple, transparent pricing</h2>
            <p className={styles.pricingDescription}>
              Choose the plan that's right for you. All plans include a 14-day
              free trial.
            </p>
          </div>
          <div className={styles.pricingGrid}>
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`${styles.pricingCard} ${
                  plan.popular ? styles.pricingCardPopular : ""
                }`}
              >
                {plan.popular && (
                  <div className={styles.popularBadge}>Most Popular</div>
                )}
                <div>
                  <div className={styles.pricingCardHeader}>
                    <h3 className={styles.pricingCardTitle}>{plan.name}</h3>
                  </div>
                  <p className={styles.pricingCardDescription}>
                    {plan.description}
                  </p>
                  <p className={styles.pricingCardPrice}>
                    <span className={styles.pricingAmount}>{plan.price}</span>
                    <span className={styles.pricingPeriod}>{plan.period}</span>
                  </p>
                  <ul className={styles.pricingFeatures}>
                    {plan.features.map((feature) => (
                      <li key={feature} className={styles.pricingFeature}>
                        <Check className={styles.pricingFeatureIcon} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`${styles.pricingButton} ${
                    plan.popular ? styles.pricingButtonPopular : ""
                  }`}
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to get started?</h2>
            <p className={styles.ctaDescription}>
              Join thousands of satisfied customers who have transformed their
              business with our platform.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.ctaPrimaryButton}>
                Start your free trial
              </button>
              <button className={styles.ctaSecondaryButton}>
                Contact sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsContainer}>
          <div className={styles.testimonialsHeader}>
            <h2 className={styles.testimonialsSubtitle}>Testimonials</h2>
            <p className={styles.testimonialsTitle}>
              Loved by businesses worldwide
            </p>
          </div>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialsList}>
              {[
                {
                  content:
                    "This platform has completely transformed how we handle our business operations. The analytics are incredible.",
                  author: "Sarah Johnson",
                  role: "CEO, TechCorp",
                  rating: 5,
                },
                {
                  content:
                    "The team collaboration features are game-changing. Our productivity has increased by 40% since switching.",
                  author: "Michael Chen",
                  role: "CTO, StartupXYZ",
                  rating: 5,
                },
                {
                  content:
                    "Customer support is outstanding. They've helped us scale from 10 to 1000 users seamlessly.",
                  author: "Emily Rodriguez",
                  role: "Operations Manager, GrowthCo",
                  rating: 5,
                },
              ].map((testimonial) => (
                <div
                  key={testimonial.author}
                  className={styles.testimonialCard}
                >
                  <div className={styles.testimonialStars}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className={styles.testimonialStar} />
                    ))}
                  </div>
                  <p className={styles.testimonialContent}>
                    {testimonial.content}
                  </p>
                  <div className={styles.testimonialAuthor}>
                    <p className={styles.testimonialAuthorName}>
                      {testimonial.author}
                    </p>
                    <p className={styles.testimonialAuthorRole}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
