import React, { useState } from 'react';
import { ShoppingBag, Search, User, Moon, Sun, Menu, X, Shield, LogOut, Truck, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logoImg from '../image/logo.jpg';

export function Navbar({ onOpenAuth, onOpenAdmin, onOpenAddItem, onOpenTracking, onSearchChange, searchQuery, activeTab, setActiveTab }) {
  const { totalItemsCount, setIsCartOpen, cartTotal } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'shop', label: 'Home' },
    { id: 'dates', label: 'Dates' },
    { id: 'nuts', label: 'Nuts' },
    { id: 'dry-fruits', label: 'Dry Fruits' },
    { id: 'spices', label: 'Spices' },
    { id: 'chocolates', label: 'Chocolates' },
    { id: 'seeds', label: 'Seeds' },
    { id: 'herbs', label: 'Herbs' },
    { id: 'snacks', label: 'Snacks' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#141414] border-b border-gray-200 dark:border-neutral-800 shadow-sm transition-colors">

      {/* Top Bright Promo Announcement Bar */}
      <div className="bg-[#fee000] text-[#1d1d1d] font-bold text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4 text-center tracking-wide shadow-inner select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="bg-[#1d1d1d] text-[#fee000] text-[9px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
              Special Offer
            </span>
            <span>
              Free Express Delivery on Orders Above <strong className="font-black text-black">₹ 499</strong>
            </span>
          </div>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold">
            <span>Use Code</span>
            <span className="bg-[#1d1d1d] text-white px-1.5 py-0.5 rounded font-mono font-black text-[10px] sm:text-[11px] tracking-wider">
              YAHIYA10
            </span>
            <span>for 10% OFF</span>
          </div>
        </div>
      </div>

      {/* Main Branding & Search Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">

        {/* Mobile menu trigger + Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg flex-shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Yahiya Traders Brand Logo */}
          <div
            onClick={() => { setActiveTab('shop'); }}
            className="cursor-pointer flex items-center gap-2 sm:gap-3 select-none group min-w-0"
          >
            {/* Custom Brand Logo from image folder */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#fee000] shadow-sm group-hover:scale-105 transition-transform flex-shrink-0 bg-white">
              <img
                src={logoImg}
                alt="Yahiya Traders"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg sm:text-2xl tracking-tight text-[#1d1d1d] dark:text-white truncate">
                  Yahiya Traders
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#fee000] flex-shrink-0"></span>
              </div>
              <p className="text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.2em] uppercase font-bold text-neutral-500 dark:text-neutral-400 -mt-0.5 truncate">
                Sourced Globally
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Product Search Input */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search premium dates, almonds, cashews, chocolates, hampers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#f8f9fa] dark:bg-[#1f1f1f] text-sm text-[#1d1d1d] dark:text-neutral-100 rounded-full pl-11 pr-10 py-2.5 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-[#fee000] focus:ring-2 focus:ring-[#fee000]/30 transition"
            />
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions (Theme, Track, Account, Cart) */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          
          {/* Mobile search button indicator if on small screen */}
          <div className="md:hidden">
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-[11px] text-neutral-500 underline mr-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Admin Direct Actions */}
          {user && isAdmin && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fee000] hover:bg-[#f5d600] active:scale-[0.98] text-[#1d1d1d] text-xs font-black shadow-xs transition cursor-pointer"
                title="Open Admin Dashboard"
              >
                <Shield size={14} />
                <span className="hidden sm:inline">Admin Dashboard</span>
              </button>
              <button
                onClick={onOpenAddItem}
                className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full bg-[#108474] hover:bg-[#0d6e61] text-white text-xs font-black shadow-xs transition cursor-pointer"
                title="Add new item to catalog"
              >
                <Plus size={15} />
                <span className="hidden sm:inline">+ Add Item</span>
              </button>
            </div>
          )}

          {/* User Account / Admin */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 sm:p-1.5 sm:px-3 text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                  aria-label="User Account"
                >
                  <div className="w-6 h-6 sm:w-6 sm:h-6 rounded-full bg-[#1d1d1d] text-[#fee000] flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl p-1.5 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">{user.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300">
                          👑 Store Admin
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => { onOpenAddItem(); setUserDropdownOpen(false); }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-black text-[#108474] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl mt-1"
                        >
                          <Plus size={14} />
                          <span>+ Add New Item</span>
                        </button>
                        <button
                          onClick={() => { onOpenAdmin(); setUserDropdownOpen(false); }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl mt-0.5"
                        >
                          <Shield size={14} className="text-[#fee000]" />
                          Admin Dashboard
                        </button>
                      </>
                    )}

                    {onOpenTracking && (
                      <button
                        onClick={() => { onOpenTracking(); setUserDropdownOpen(false); }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl mt-0.5"
                      >
                        <Truck size={14} />
                        Track Orders
                      </button>
                    )}

                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl mt-0.5"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition flex items-center gap-1.5"
                title="Sign in to your account"
              >
                <User size={17} />
                <span className="hidden xs:inline sm:inline">Sign In</span>
              </button>
            )}
          </div>

          {/* PalmTree Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 sm:px-3.5 sm:py-2 bg-[#fee000] hover:bg-[#f5d600] active:scale-95 text-[#1d1d1d] font-semibold rounded-full shadow-sm transition flex items-center gap-1.5 sm:gap-2"
            aria-label="View shopping bag"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline text-xs font-bold">Cart</span>
            {totalItemsCount > 0 && (
              <span className="bg-[#1d1d1d] text-white text-[10px] sm:text-[11px] font-bold min-w-[18px] h-[18px] sm:w-5 sm:h-5 px-1 rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search dates, nuts, chocolates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#f8f9fa] dark:bg-[#1f1f1f] text-xs text-[#1d1d1d] dark:text-neutral-100 rounded-full pl-9 pr-8 py-2 border border-neutral-200 dark:border-neutral-700 focus:outline-none"
          />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Category Subnav Bar (Desktop) */}
      <div className="hidden md:block border-t border-neutral-100 dark:border-neutral-800/80 bg-[#fafafa] dark:bg-[#181818]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 lg:space-x-3 overflow-x-auto py-2 scrollbar-none">
            {navLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1d1d1d] text-white dark:bg-[#fee000] dark:text-[#1d1d1d] shadow-sm'
                      : 'text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#181818] px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
          
          {/* User Status in Mobile Drawer */}
          {user ? (
            <div className="p-3.5 mb-3 rounded-2xl bg-neutral-50 dark:bg-[#222222] border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1d1d1d] text-[#fee000] flex items-center justify-center text-sm font-black flex-shrink-0 shadow-sm border border-[#fee000]/40">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">{user.name}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    {isAdmin ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300">
                        👑 Store Admin
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        🌴 Verified Member
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700/60 grid grid-cols-2 gap-2">
                {isAdmin && (
                  <button
                    onClick={() => { onOpenAddItem(); setMobileMenuOpen(false); }}
                    className="py-2 px-2 bg-[#108474] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Plus size={14} />
                    <span>+ Add Item</span>
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                    className="py-2 px-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Shield size={14} className="text-[#fee000]" />
                    <span>Admin</span>
                  </button>
                )}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className={`${isAdmin ? 'col-span-2' : 'col-span-2'} py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer`}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 mb-3 bg-[#fee000] hover:bg-[#f5d600] active:scale-[0.99] text-[#1d1d1d] rounded-2xl text-xs font-black shadow-sm transition cursor-pointer"
            >
              <User size={16} />
              <span>Sign In / Join Yahiya Traders</span>
            </button>
          )}

          {/* Quick Tracking Button */}
          {onOpenTracking && (
            <button
              onClick={() => { onOpenTracking(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            >
              <Truck size={15} className="text-[#108474]" />
              <span>Track Your Order</span>
            </button>
          )}

          <div className="pt-1 pb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-3">
              Explore Collections
            </span>
          </div>

          <div className="space-y-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === link.id
                    ? 'bg-[#fee000] text-[#1d1d1d] shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

        </div>
      )}

    </header>
  );
}
