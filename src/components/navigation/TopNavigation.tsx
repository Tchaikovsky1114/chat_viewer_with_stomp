import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function TopNavigation() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const onProfileButtonClick = () => {
    setIsProfileMenuOpen(prev => !prev);
  }
  
  return (
    <nav>
      <div className="flex justify-between items-center h-16 bg-slate-700 text-white px-2">
        
        <div className="flex items-center">
          <Link to="/" className="flex-shrink-0">
            <img className="h-8 w-8" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow" />
          </Link>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/nextjs" className="px-3 py-2 rounded-md text-sm font-medium">Next.js</Link>
              <Link to="/springboot" className="px-3 py-2 rounded-md text-sm font-medium">Spring Boot</Link>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="ml-4 flex items-center md:ml-6">
            <button className="p-1 border-2 border-transparent text-gray-400 rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700" aria-label="Notifications">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="ml-3 relative">
              <div>
                <button
                  className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid" id="user-menu" aria-label="User menu" aria-haspopup="true"
                  onClick={onProfileButtonClick}
                  >
                  <img className="h-8 w-8 rounded-full" src="https://avatars.githubusercontent.com/u/76861604?v=4" alt="" />
                </button>
              </div>

              {
                isProfileMenuOpen &&
                <div className="absolute origin-top-right right-1 mt-2 w-48 rounded-md shadow-lg z-50 border-4 border-t-sky-300 border-r-sky-400 border-b-sky-500 border-l-sky-600 ring-2 ring-rose-400">
                <div className="py-1 rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                  <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-bold" role="menuitem">Your Profile</Link>
                  <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-bold" role="menuitem">Settings</Link>
                  <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-bold" role="menuitem">Sign out</Link>
                </div>
              </div>
              }
            </div>

          </div>
        </div>

        <div className="-mr-2 flex md:hidden">
          <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white" aria-label="Main menu" aria-expanded="false">
            <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg className="hidden h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>

    </nav>
  )
}

export default TopNavigation