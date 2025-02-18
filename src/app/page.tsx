"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import Navigation from './components/Navigation'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08040e] to-[#1a1033]">
      <Navigation />

      {/* Hero Section */}
      <div className="relative pt-32 pb-32 flex content-center items-center justify-center min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-6/12 px-4">
              <div className="pr-12">
                <h1 className="text-5xl font-bold text-white leading-tight mb-6">
                  Track Your Field Data with Precision
                </h1>
                <p className="mt-4 text-lg text-gray-300 mb-8">
                  Streamline your field operations with our comprehensive tracking system. 
                  Get real-time insights and make data-driven decisions.
                </p>
                <div className="flex gap-4">
                  <Link 
                    href="/signup" 
                    className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                  <Link 
                    href="/about" 
                    className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-purple-600 transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full md:w-6/12 px-4">
              <div className="relative h-[500px] rounded-lg shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-800 to-blue-700 h-full w-full opacity-75"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-xl">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-[#0c0817]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-gray-400">Everything you need to manage your field data effectively</p>
          </div>
          
          <div className="flex flex-wrap">
            {[
              {
                title: "Real-time Tracking",
                description: "Monitor your field data in real-time with instant updates and notifications.",
                icon: "📊"
              },
              {
                title: "Data Analytics",
                description: "Powerful analytics tools to help you make informed decisions.",
                icon: "📈"
              },
              {
                title: "Secure Storage",
                description: "Your data is encrypted and stored securely in our cloud infrastructure.",
                icon: "🔒"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="w-full md:w-4/12 px-4 text-center mb-8"
              >
                <div className="bg-[#1a1033] rounded-xl p-8 h-full transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Get Started?</h2>
          <Link 
            href="/signup" 
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0c0817] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap text-center lg:text-left">
            <div className="w-full lg:w-6/12 px-4">
              <h4 className="text-2xl font-bold text-white mb-4">FieldData</h4>
              <p className="text-gray-400">
                Empowering organizations with powerful field data tracking solutions.
              </p>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="flex flex-wrap items-top">
                <div className="w-full lg:w-4/12 px-4 ml-auto">
                  <span className="block text-white text-sm font-bold mb-2">Useful Links</span>
                  <ul className="list-unstyled">
                    <li>
                      <Link href="/about" className="text-gray-400 hover:text-white font-semibold block pb-2 text-sm">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-gray-400 hover:text-white font-semibold block pb-2 text-sm">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-700" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-gray-400 py-1">
                Copyright © {new Date().getFullYear()} FieldData
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
