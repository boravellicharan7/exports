import React from 'react';
import './Profile.css';
import {FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaGlobe, FaShoppingCart, FaFileInvoice, FaChartBar, FaTruck, FaChartLine } from "react-icons/fa";



const UserProfilePage = () => {
  return (
    <div className="profile-container">
      {/* Main Content */}
      <div className="profile-main">
        {/* Personal Information Section */}
        <section className="user-info section">
          <h2 className="section-title">Leadership</h2>
          <div className="user-details">
            <img
              src="src\assets\profile_pic.png"
              alt="CEO Portrait"
              className="user-image"
            />
            <div className="user-text">
              <h3 className="user-name">Rajesh Sharma</h3>
              <p className="user-designation">Founder & Chief Executive Officer</p>
              <p className="user-bio">
                With over 25 years of experience in international trade, Rajesh Sharma has built Surya Exports & Imports from the ground up. His expertise in global market trends and commitment to quality has established the company as a trusted name in the industry.
              </p>
            </div>
          </div>
        </section>

        {/* Company Information Section */}
        <section className="company-info section">
          <h2 className="section-title">About Our Company</h2>
          <div className="company-about">
            <h3>Who We Are</h3>
            <p>
              Surya Exports & Imports is a premier trading company specializing in facilitating global commerce between India and international markets. We pride ourselves on our deep understanding of trade regulations, market demands, and quality assurance.
            </p>

            <h3>Our History</h3>
            <p>
              Established in 1995 in Mumbai, India, Surya began as a small textile export business. Over the decades, we've expanded our offerings to include a wide range of products while maintaining our commitment to excellence and integrity in all our dealings.
            </p>

            <h3>Our Mission</h3>
            <p>
              To facilitate seamless international trade by connecting quality producers with global markets, ensuring compliance with international standards, and delivering exceptional value to all our stakeholders.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="services section">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
              <FaGlobe className="text-4xl text-yellow-500" />
              </div>
              <h3>Export Services</h3>
              <p>Facilitating the export of Indian products to global markets with complete documentation support.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
              <FaShoppingCart className="text-4xl text-green-500" />
              </div>
              <h3>Import Services</h3>
              <p>Sourcing quality products from international suppliers for the Indian market.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
              <FaFileInvoice className="text-4xl text-blue-500" />
              </div>
              <h3>Customs Clearance</h3>
              <p>Managing customs documentation and clearance processes to ensure smooth transitions.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
              <FaTruck className="text-4xl text-red-500" />
              </div>
              <h3>Trade Consultation</h3>
              <p>Expert advice on international trade regulations, compliance, and market entry strategies.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
              <FaChartLine className="text-4xl text-indigo-500" />
              </div>
              <h3>Logistics Solutions</h3>
              <p>End-to-end logistics management including transportation, warehousing, and distribution.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
              <FaChartBar className="text-4xl text-indigo-500" />
              </div>
              <h3>Market Research</h3>
              <p>Comprehensive analysis of international markets and product demand forecasting.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-100 py-4 px-3 text-gray-700 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Contact Section */}
        <div>
          <h4 className="font-bold text-xs uppercase mb-2">IN - SGL Mumbai</h4>
          <p className="text-xs">📞 +91 2266378000 | ✉️ ind-info@sgl.com</p>
        </div>

        {/* Business Section */}
        <div className="text-center">
          <p className="text-xs">Solutions / Local Information / E-Business</p>
          <div className="flex justify-center space-x-3 mt-2">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-blue-600 hover:text-blue-800" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-blue-400 hover:text-blue-600" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-pink-500 hover:text-pink-700" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-blue-700 hover:text-blue-900" />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="text-red-600 hover:text-red-800" />
            </a>
          </div>
        </div>

        {/* HQ Section */}
        <div className="text-right text-xs">
          <p>Headquarters: +41 227038888</p>
          <p>Geneva, Switzerland</p>
        </div>
      </div>

      {/* Legal Links */}
      <div className="text-center mt-2 text-xs text-gray-400 border-t border-gray-200 pt-2">
        <p>Privacy - Terms - Certifications - Contact</p>
      </div>
    </footer>
    </div>
  );
};

export default UserProfilePage;