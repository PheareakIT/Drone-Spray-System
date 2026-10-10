import React from 'react';
import { Droplets, Users, DollarSign, Activity, Calendar, Phone, ArrowUpRight, Plus } from 'lucide-react';

export default function Overview({ sprays, customers, users, setActiveTab, openNewSprayModal, openNewCustomerModal }) {
  // Calculations
  const totalSprays = sprays.length;
  const totalCustomers = customers.length;
  const totalRevenue = sprays.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice || 0), 0);
  const totalUsers = users.length;

  const recentSprays = [...sprays].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Spray Control Center Online</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Agricultural Spraying Dashboard
          </h2>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base leading-relaxed">
            Monitor chemical distributions, customer records, and team assignments in real time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={openNewSprayModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Spray</span>
            </button>
            <button
              onClick={openNewCustomerModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700/60 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm backdrop-blur-md border border-white/20 transition-all active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Register Customer</span>
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Sprays</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{totalSprays}</div>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <span>Logged sessions</span>
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg hover:border-teal-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Customers</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{totalCustomers}</div>
          <p className="text-xs text-teal-400 mt-1 flex items-center gap-1">
            <span>Registered farms / clients</span>
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Value</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
            <span>Sum of (Qty × Unit Price)</span>
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Staff / Admins</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{totalUsers}</div>
          <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
            <span>Authorized users</span>
          </p>
        </div>
      </div>

      {/* Recent Activity Table/Cards */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Spray Applications</h3>
            <p className="text-xs text-slate-400">Latest field chemical and pesticide spray records</p>
          </div>
          <button
            onClick={() => setActiveTab('sprays')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {recentSprays.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-700 rounded-2xl">
            <Droplets className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No spray records created yet.</p>
            <button
              onClick={openNewSprayModal}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-xl text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record the first spray</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="w-full text-left border-collapse min-w-125">
              <thead>
                <tr className="border-b border-slate-700/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Chemical / Spray</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-sm">
                {recentSprays.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="py-3.5 px-4 text-slate-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400/80 shrink-0" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">
                        {item.customer?.name || 'Unknown Customer'}
                      </div>
                      {item.customer?.phone && (
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{item.customer.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-emerald-300">
                      {item.spray}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-slate-300">${item.unitPrice?.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-bold text-white text-right">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
