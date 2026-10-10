import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import DroneLogo from '../components/DroneLogo';
import {
  Droplets,
  LayoutDashboard,
  Users,
  Shield,
  CreditCard,
  LogOut,
  Menu,
  X,
  RefreshCw,
  Globe,
  Info,
  PhoneCall,
} from 'lucide-react';

export default function DashboardLayout({ onRefresh, loadingData, counts = {} }) {
  const { user, signout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminOrSuper = user?.role === 'admin' || user?.role === 'super';

  const handleSignout = async () => {
    await signout();
    navigate('/login');
  };

  const navLinks = isAdminOrSuper
    ? [
        { to: '/', label: t('navOverview'), icon: LayoutDashboard },
        { to: '/sprays', label: t('navSprays'), icon: Droplets, count: counts.sprays },
        { to: '/customers', label: t('navCustomers'), icon: Users, count: counts.customers },
        { to: '/payments', label: t('navPayments'), icon: CreditCard, count: counts.pendingPayments },
        { to: '/users', label: t('navUsers'), icon: Shield, count: counts.users },
        { to: '/about', label: t('navAbout'), icon: Info },
        { to: '/contact', label: t('navContact'), icon: PhoneCall },
      ]
    : [
        { to: '/about', label: t('navAbout'), icon: Info },
        { to: '/contact', label: t('navContact'), icon: PhoneCall },
      ];

  const getRoleLabel = (r) => {
    if (r === 'super') return t('superRole');
    if (r === 'admin') return t('adminRole');
    return t('userRole');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-white">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 p-1.5">
            <DroneLogo className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">
              ដ្រូនកសិកម្ម<span className="text-emerald-400">ព្រៃតូច</span>
            </h1>
            <span className="text-[10px] text-slate-400">{getRoleLabel(user?.role)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1"
            title="ប្តូរភាសា / Switch Language"
          >
            <span>{lang === 'km' ? '🇰🇭' : '🇺🇸'}</span>
          </button>

          {isAdminOrSuper && onRefresh && (
            <button
              onClick={onRefresh}
              title={t('syncDatabase')}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-slate-900/80 border-r border-slate-800/80 p-6 shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 p-2">
            <DroneLogo className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight">
              ដ្រូនកសិកម្ម<span className="text-emerald-400">ព្រៃតូច</span>
            </h1>
            <p className="text-xs text-slate-400">{t('appSubtitle')}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 flex-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            {isAdminOrSuper ? t('mainManagement') : t('informationSupport')}
          </p>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300">
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Language & User Card at Bottom */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          {/* Language Switch Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-300 transition-all"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>ភាសា / Language</span>
            </div>
            <span className="bg-slate-700 px-2 py-0.5 rounded-md text-emerald-300">
              {lang === 'km' ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}
            </span>
          </button>

          {/* User Profile Card */}
          <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/50 flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <div className="text-sm font-bold text-white truncate">{user?.username}</div>
              <div className="text-xs text-slate-400 truncate">{user?.email}</div>
              <div className="mt-1">
                <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {user?.role}
                </span>
              </div>
            </div>
            <button
              onClick={handleSignout}
              title={t('signOut')}
              className="p-2 rounded-xl bg-slate-700/60 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {isAdminOrSuper && onRefresh && (
            <button
              onClick={onRefresh}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 rounded-xl transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{t('syncDatabase')}</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-xs bg-slate-900 h-full p-5 flex flex-col justify-between border-r border-slate-800 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white p-1.5">
                    <DroneLogo className="w-full h-full" />
                  </div>
                  <span className="font-bold text-white">ដ្រូនកសិកម្មព្រៃតូច</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30'
                            : 'text-slate-400'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                type="button"
                onClick={toggleLanguage}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300"
              >
                <span>ភាសា / Language</span>
                <span>{lang === 'km' ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}</span>
              </button>

              <div className="text-sm font-bold text-white">{user?.username}</div>
              <div className="text-xs text-slate-400">{user?.email}</div>
              <button
                onClick={handleSignout}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-semibold text-xs rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('signOut')}</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
        {isAdminOrSuper && loadingData && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-400 text-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>កំពុងធ្វើបច្ចុប្បន្នភាពទិន្នន័យពី MongoDB...</span>
          </div>
        )}
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex justify-around py-2.5 px-2 z-40">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
