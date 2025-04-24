import React from 'react'

const Footer = () => {
    return (
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Brand and Address */}
            <div>
              <h2 className="text-xl font-semibold text-white">Calubcob SHS</h2>
              <p className="mt-2 text-sm">Alangilan, Batangas</p>
            </div>
            
            {/* Social Media Links */}
            <div>
              <h2 className="text-xl font-semibold text-white">Follow Us</h2>
              <div className="flex flex-col md:flex-row md:gap-4 gap-2 mt-2">
                <a href="#" className="hover:text-white">Facebook</a>
                <a href="#" className="hover:text-white">Twitter (X)</a>
                <a href="#" className="hover:text-white">Instagram</a>
              </div>
            </div>
            
            {/* Footer Links */}
            <div>
              <h2 className="text-xl font-semibold text-white">Quick Links</h2>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 text-center border-t border-gray-700 pt-4">
            <p>&copy; 2025 All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

export default Footer