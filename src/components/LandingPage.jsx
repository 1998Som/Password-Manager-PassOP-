import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { FaShieldAlt, FaLock, FaSync, FaMobileAlt } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-400/20 to-pink-400/20 opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Secure Your Digital Life with PassOP
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 dark:text-gray-300">
              Your one-stop solution for managing passwords securely and efficiently.
              Never worry about forgotten passwords again.
            </p>
            <SignedOut>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignUpButton mode="modal">
                  <button className="px-8 py-4 rounded-lg text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                    Get Started Free
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="px-8 py-4 rounded-lg text-lg font-semibold bg-white text-gray-800 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg border border-gray-200">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
            <SignedIn>
              <a
                href="/manager"
                className="inline-block px-8 py-4 rounded-lg text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Go to Password Manager
              </a>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Why Choose PassOP?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FaShieldAlt />}
              title="Bank-Level Security"
              description="Your passwords are protected with military-grade encryption."
            />
            <FeatureCard
              icon={<FaLock />}
              title="Zero-Knowledge"
              description="We can't access your passwords. Only you have the key."
            />
            <FeatureCard
              icon={<FaSync />}
              title="Auto-Sync"
              description="Access your passwords across all your devices seamlessly."
            />
            <FeatureCard
              icon={<FaMobileAlt />}
              title="Mobile Friendly"
              description="Secure access to your passwords on the go."
            />
          </div>
        </div>
      </section>

      {/* Security Info Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Your Security is Our Priority
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
              <p className="text-center mb-8">
                PassOP uses advanced encryption algorithms to ensure your passwords are
                always secure. We implement industry best practices and regular
                security audits to maintain the highest level of protection for your
                data.
              </p>
              <div className="flex justify-center">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg">
                      Start Securing Your Passwords
                    </button>
                  </SignUpButton>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="text-3xl text-blue-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default LandingPage;
