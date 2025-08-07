import React, { useState } from "react";
import { FaLock, FaGithub, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="relative w-full z-20">
      {/* Gradient Border */}
      <div className="absolute inset-0 w-full h-full rounded-none bg-gradient-to-tr from-blue-500 via-purple-400 to-pink-400 opacity-70 blur-lg z-[-1]"></div>
      <div className="relative w-full bg-white/10 backdrop-blur-lg shadow-xl border-b border-white/20 flex flex-col items-center px-0 py-0">
        <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center w-full">
            <div className="logo flex items-center gap-1 sm:gap-2 font-extrabold text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in mr-auto">
              <span className="text-blue-300">&lt;</span>
              Pass
              <span className="text-blue-300">OP/&gt;</span>
              <FaLock className="ml-1 sm:ml-2 text-blue-200 animate-pulse text-lg sm:text-xl lg:text-2xl" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <ul className="flex gap-6 lg:gap-10 text-base lg:text-lg font-semibold">
                <li>
                  <a
                    className="px-3 lg:px-5 py-2 rounded-lg transition-all duration-200 bg-gradient-to-r from-blue-500/10 via-purple-400/10 to-pink-400/10 hover:from-blue-500/30 hover:to-pink-400/30 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300/40 shadow-md"
                    href="/"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    className="px-3 lg:px-5 py-2 rounded-lg transition-all duration-200 bg-gradient-to-r from-blue-500/10 via-purple-400/10 to-pink-400/10 hover:from-blue-500/30 hover:to-pink-400/30 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300/40 shadow-md"
                    href=""
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    className="px-3 lg:px-5 py-2 rounded-lg transition-all duration-200 bg-gradient-to-r from-blue-500/10 via-purple-400/10 to-pink-400/10 hover:from-blue-500/30 hover:to-pink-400/30 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300/40 shadow-md"
                    href=""
                  >
                    Contact
                  </a>
                </li>
              </ul>
              <a
                href="https://github.com/1998Som/Password-Manager-PassOP-"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 lg:ml-4 flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white font-bold shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                title="View on GitHub"
              >
                <FaGithub className="text-lg lg:text-2xl" />
                <span className="hidden lg:inline">GitHub</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden ml-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300/40"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-white text-xl" />
              ) : (
                <FaBars className="text-white text-xl" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    className="block px-4 py-3 rounded-lg transition-all duration-200 bg-gradient-to-r from-blue-500/10 via-purple-400/10 to-pink-400/10 hover:from-blue-500/30 hover:to-pink-400/30 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300/40 shadow-md"
                    href="/"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    className="block px-4 py-3 rounded-lg transition-all duration-200 bg-gradient-to-r from-blue-500/10 via-purple-400/10 to-pink-400/10 hover:from-blue-500/30 hover:to-pink-400/30 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300/40 shadow-md"
                    href=""
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    className="block px-4 py-3 rounded-lg transition-all duration-200 bg-gradient-to-r from-blue-500/10 via-purple-400/10 to-pink-400/10 hover:from-blue-500/30 hover:to-pink-400/30 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300/40 shadow-md"
                    href=""
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/1998Som/Password-Manager-PassOP-"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 lg:ml-4 flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white font-bold shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                    title="View on GitHub"
                  >
                    <FaGithub className="text-lg lg:text-2xl" />
                    <span className="hidden lg:inline">GitHub</span>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
