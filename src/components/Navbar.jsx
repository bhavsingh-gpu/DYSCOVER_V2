import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { VscHome, VscCloudUpload, VscGraph, VscSignOut } from 'react-icons/vsc';
import Dock from './Dock.jsx';
import { getCurrentUser } from '../services/api';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        return document.body.classList.contains('dark');
    });
    const dropdownRef = useRef(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, []);

    useEffect(() => {
        document.body.classList.toggle('dark', isDark);
    }, [isDark]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('dyscover_user');
        navigate('/');
    };

    const getUserInitial = () => {
        if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
        if (user?.email) return user.email.charAt(0).toUpperCase();
        return 'U';
    };

    const items = [
        {
            icon: <VscHome size={22} />,
            label: 'Study',
            onClick: () => navigate('/home'),
            className: location.pathname === '/home' ? 'bg-orange-500/20 border-orange-500/50' : ''
        },
        {
            icon: <VscCloudUpload size={22} />,
            label: 'Upload',
            onClick: () => navigate('/upload'),
            className: location.pathname === '/upload' ? 'bg-orange-500/20 border-orange-500/50' : ''
        },
        {
            icon: <VscGraph size={22} />,
            label: 'Stats',
            onClick: () => navigate('/dashboard'),
            className: location.pathname === '/dashboard' ? 'bg-orange-500/20 border-orange-500/50' : ''
        },
        {
            icon: <div className="text-xl">{isDark ? '🌙' : '☀️'}</div>,
            label: isDark ? 'Calm night' : 'Soft day',
            onClick: () => setIsDark(!isDark),
            className: ''
        },
        {
            icon: (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-500 text-white font-bold text-xs">
                    {getUserInitial()}
                </div>
            ),
            label: 'Account',
            onClick: () => setShowDropdown(!showDropdown),
            children: showDropdown && (
                <div className="dock-dropdown-menu" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
                    <div className="px-4 py-2 border-b border-white/10 mb-1">
                        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Account</p>
                        <p className="text-sm font-bold truncate text-white">
                            {user?.displayName || user?.email || 'Learner'}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition"
                    >
                        <VscSignOut size={18} />
                        Sign Out
                    </button>
                </div>
            )
        }
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-dysGray/10 bg-[#fdfaf3]/90 backdrop-blur-md dark:border-white/5 dark:bg-[#050816]/90 font-lexend">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-8">
                <Link to="/home" className="flex items-center gap-3 group">
                    <img src="/FAVICON_DYSCOVER.png" alt="logo" className="h-12 w-12 rounded-xl shadow-lg transition-transform group-hover:scale-105" />
                    <div className="hidden sm:block leading-tight text-left">
                        <p className="text-2xl font-black tracking-tighter text-ink dark:text-white">DYSCOVER</p>
                        <p className="text-[0.7rem] font-bold text-dysGray dark:text-cream/50 uppercase tracking-widest">Inclusive Support</p>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <Dock items={items} baseItemSize={52} magnification={65} distance={100} />
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
