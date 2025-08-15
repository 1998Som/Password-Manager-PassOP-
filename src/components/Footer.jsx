import React from 'react'

const Footer = () => {
  return (
    <footer className="relative w-full mt-16">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-blue-500 via-purple-400 to-pink-400 opacity-40 blur-lg z-[-1]"></div>
      <div className="relative w-full bg-white/10 backdrop-blur-lg shadow-xl border-t border-white/20 flex flex-col items-center justify-center py-6">
        <p className="text-white/80 text-center text-sm font-medium">
          &copy; {new Date().getFullYear()} PassOP. 
          All rights reserved BY SOM.
        </p>
        <a
          href="https://github.com/your-repo-url"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-2 px-4 py-1 rounded bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </footer>
  )
}

export default Footer
