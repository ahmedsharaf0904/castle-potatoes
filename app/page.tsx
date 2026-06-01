'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          setIsAuthenticated(true);
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('[v0] Auth check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background border-b border-border z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CP</span>
              </div>
              <span className="text-xl font-bold text-foreground">Castle Potatoes</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-foreground hover:text-primary transition">Features</a>
              <a href="#pricing" className="text-foreground hover:text-primary transition">Pricing</a>
              <a href="#contact" className="text-foreground hover:text-primary transition">Contact</a>
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground text-balance leading-tight">
                Manage Representatives & Customers Effortlessly
              </h1>
              <p className="mt-6 text-xl text-secondary leading-relaxed">
                A powerful platform designed to streamline your business operations, manage customer relationships, and empower your sales team with the tools they need to succeed.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-muted transition font-semibold text-center"
                >
                  Admin Portal
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-secondary text-lg">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Everything You Need</h2>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Built for teams that want to scale their business without complexity
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '👥',
                title: 'Customer Management',
                description: 'Track and manage all your customers in one centralized location'
              },
              {
                icon: '📈',
                title: 'Sales Analytics',
                description: 'Get real-time insights into your sales performance and metrics'
              },
              {
                icon: '🤝',
                title: 'Team Collaboration',
                description: 'Collaborate seamlessly with your entire team and stay aligned'
              },
              {
                icon: '📧',
                title: 'Communication Tools',
                description: 'Integrated messaging and email to keep everyone connected'
              },
              {
                icon: '🔐',
                title: 'Enterprise Security',
                description: 'Bank-level security to protect your sensitive business data'
              },
              {
                icon: '⚙️',
                title: 'Custom Workflows',
                description: 'Automate repetitive tasks and create custom workflows'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-background p-8 rounded-xl border border-border hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Choose the plan that&apos;s right for your business
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$29',
                features: ['Up to 100 customers', 'Basic analytics', 'Email support']
              },
              {
                name: 'Professional',
                price: '$79',
                features: ['Up to 1000 customers', 'Advanced analytics', 'Priority support', 'Custom workflows'],
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: ['Unlimited customers', 'Advanced analytics', '24/7 support', 'Custom integration']
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-8 rounded-xl border transition ${
                  plan.highlighted
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border bg-background hover:shadow-lg'
                }`}
              >
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-primary mb-4">
                  {plan.price}
                  <span className="text-lg text-secondary font-normal">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-secondary">
                      <span className="text-primary">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-semibold transition ${
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-blue-700'
                    : 'border border-primary text-primary hover:bg-muted'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of teams already using Castle Potatoes to manage their operations
          </p>
          <button className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-blue-50 transition font-semibold">
            Start Your Free Trial Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="font-bold">CP</span>
                </div>
                <span className="font-bold">Castle Potatoes</span>
              </div>
              <p className="text-blue-200">Empowering businesses to manage growth</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 pt-8 text-center text-blue-200">
            <p>&copy; 2024 Castle Potatoes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
