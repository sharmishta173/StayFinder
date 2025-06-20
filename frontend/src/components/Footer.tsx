import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 pt-12 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Safety Information
                </Link>
              </li>
              <li>
                <Link to="/cancellation" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Cancellation Options
                </Link>
              </li>
              <li>
                <Link to="/covid" className="text-gray-600 hover:text-primary-600 transition-colors">
                  COVID-19 Response
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/diversity" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Diversity & Belonging
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link to="/referrals" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Referrals
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Community Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hosting</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/become-host" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link to="/host-resources" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Host Resources
                </Link>
              </li>
              <li>
                <Link to="/community-forum" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link to="/hosting-responsibly" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Host Responsibly
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">StayFinder</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/investors" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Investors
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              &copy; {currentYear} StayFinder, Inc. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 text-sm text-gray-600">
              <Link to="/privacy" className="hover:text-primary-600 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-primary-600 transition-colors">
                Terms
              </Link>
              <Link to="/sitemap" className="hover:text-primary-600 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>

          <div className="flex space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FiGithub className="text-xl" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FiTwitter className="text-xl" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FiInstagram className="text-xl" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FiFacebook className="text-xl" />
            </a>
          </div>
        </div>

        <div className="mt-4 text-center md:text-left">
          <p className="text-gray-500 text-xs">
            Currency displayed in ₹ (INR). StayFinder is not a real company and this is a demo project.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;