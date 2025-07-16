import { FileQuestion, FileQuestionIcon, MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Link,  useNavigate, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser, useAuth } from '@clerk/clerk-react'

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const {user} = useUser()
  const {openSignIn} = useClerk()
  const navigate = useNavigate()
  const location = useLocation();
  
  useEffect(() => {
    const initialSearch = new URLSearchParams(location.search).get('search') || '';
    setSearchTerm(initialSearch);
    if (initialSearch) setShowSearch(true); // open search if there's a query
  }, [location.search]);

  // Auto-search as user types (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchTerm.trim();
      const isOnProblemsPage = location.pathname === "/problems";

      if (trimmed === "") {
        if (isOnProblemsPage) navigate("/problems"); // only if already on problems
      } else {
        navigate(`/problems?search=${encodeURIComponent(trimmed)}`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-30 py-5'>
       <Link to='/' className='max-md:flex-1 z-50'>
          <h1 className="text-3xl md:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Code<span className="text-white">Rush</span>
          </h1>
       </Link>

       <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium \
        max-md:text-lg z-50 flex flex-col md:flex-row items-center \
        max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen \
        min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border \
        border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
  
          <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={()=> setIsOpen(!isOpen)}/>
  
          <Link onClick={()=> {scrollTo(0,0), setIsOpen(false)}} to='/'>Home</Link>
          <Link onClick={()=> {scrollTo(0,0), setIsOpen(false)}} to='/problems'>Problems</Link>
          <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to="/add-problem">
            Add Problem
          </Link>
          <Link onClick={()=> {scrollTo(0,0), setIsOpen(false)}} to='/competitions'>Competitions</Link>
        </div>

       <div className='flex items-center gap-8'>
        <SearchIcon
          className='w-6 h-6 cursor-pointer text-white'
          onClick={() => setShowSearch(true)}
        />

        {showSearch && (
          <div className='absolute right-12 top-15 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 z-50'>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search problems..."
              className="px-3 py-1 rounded-lg text-sm bg-white/10 text-white border border-gray-300/20 placeholder:text-gray-300 focus:outline-none"
            />
            <XIcon
              className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer"
              onClick={() => {
                setSearchTerm('');
                setShowSearch(false);
              }}
            />
          </div>
        )}

        {
          !user ? (
            <button onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary
            hover:bg-primary-dull transition rounded-full font-medium
            cursor-pointer'>Login</button>
          ) : (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="Problems Solved" labelIcon={<TicketPlus width={15}/>} onClick={()=> navigate('/problems-solved')}/>
                <UserButton.Action label="My Problems" labelIcon={<FileQuestionIcon width={15}/>} onClick={()=> navigate('/my-problems')}/>
              </UserButton.MenuItems>
            </UserButton>
          )
        }
        
       </div>
       <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={()=> setIsOpen(!isOpen)}/>
    </div>
  )
}

export default Navbar