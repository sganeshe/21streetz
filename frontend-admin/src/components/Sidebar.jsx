import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Newspaper, Mic2, Ticket, Users } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/dashboard/products', icon: ShoppingBag },
    { name: 'Orders', path: '/dashboard/orders', icon: ShoppingCart },
    { name: 'News', path: '/dashboard/news', icon: Newspaper },
    { name: 'Press', path: '/dashboard/press', icon: Mic2 },
    { name: 'Coupons', path: '/dashboard/coupons', icon: Ticket },
    { name: 'Subscribers', path: '/dashboard/subscribers', icon: Users },
  ];

  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-900 h-screen flex flex-col hidden md:flex shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-neutral-900">
        <h2 className="text-xl font-bold tracking-widest text-white uppercase">21Streetz</h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'} // Ensures 'Overview' isn't always active
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`
            }
          >
            <item.icon className="w-4 h-4" strokeWidth={2.5} />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-neutral-900">
        <div className="text-[10px] uppercase tracking-widest text-neutral-600 text-center">
          Admin System v1.0
        </div>
      </div>
    </aside>
  );
}