import React, { useState } from 'react';
import { Droplets, Plus, Search, Filter, Edit2, Trash2, Calendar, User, DollarSign, Layers, AlertCircle } from 'lucide-react';
import { sprayApi } from '../api/client';

export default function SprayManagement({ sprays, customers, onRefresh, modalOpen, setModalOpen }) {
  const [search, setSearch] = useState('');
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState('');
  const [editingSpray, setEditingSpray] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customer: '',
    spray: '',
    quantity: '',
    unitPrice: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filtering
  const filteredSprays = sprays.filter((item) => {
    const matchesSearch =
      item.spray?.toLowerCase().includes(search.toLowerCase()) ||
      item.customer?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCustomer =
      !selectedCustomerFilter || item.customer?._id === selectedCustomerFilter;
    return matchesSearch && matchesCustomer;
  });

  const handleOpenAdd = () => {
    setEditingSpray(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      customer: customers[0]?._id || '',
      spray: '',
      quantity: '',
      unitPrice: '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingSpray(item);
    setFormData({
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      customer: item.customer?._id || item.customer || '',
      spray: item.spray,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer) {
      setError('Please select a customer');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
      };

      if (editingSpray) {
        await sprayApi.update(editingSpray._id, payload);
      } else {
        await sprayApi.create(payload);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, sprayName) => {
    if (!window.confirm(`Delete spray record for "${sprayName}"?`)) return;
    try {
      await sprayApi.delete(id);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete record');
    }
  };

  const calculatedTotal = (Number(formData.quantity) || 0) * (Number(formData.unitPrice) || 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/60 p-5 sm:p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Spray Application Records</h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Track daily field spray sessions, pesticide usage, and total job costs
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Spray Record</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by spray name or customer..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/90 border border-slate-700/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedCustomerFilter}
            onChange={(e) => setSelectedCustomerFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-3 bg-slate-800/90 border border-slate-700/60 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Customers</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Spray Records Table / Card Grid */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl overflow-hidden shadow-xl">
        {filteredSprays.length === 0 ? (
          <div className="text-center py-14 px-4">
            <Droplets className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">No spray records found</p>
            <p className="text-slate-500 text-xs mt-1">
              {search || selectedCustomerFilter
                ? 'Try adjusting your filters.'
                : 'Click "New Spray Record" to create your first entry.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-175">
              <thead>
                <tr className="border-b border-slate-700/60 bg-slate-900/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Chemical / Spray</th>
                  <th className="py-3.5 px-6">Qty</th>
                  <th className="py-3.5 px-6">Unit Price</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-sm">
                {filteredSprays.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="py-4 px-6 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400/80 shrink-0" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">
                        {item.customer?.name || 'Customer Deleted'}
                      </div>
                      {item.customer?.phone && (
                        <div className="text-xs text-slate-400">{item.customer.phone}</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-medium text-xs border border-emerald-500/20">
                        {item.spray}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-300">{item.quantity}</td>
                    <td className="py-4 px-6 text-slate-300">${item.unitPrice?.toFixed(2)}</td>
                    <td className="py-4 px-6 font-bold text-emerald-400">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.spray)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-white mb-1">
              {editingSpray ? 'Edit Spray Record' : 'Record New Spray'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Fill in the chemical application details below
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                    Customer (FK) *
                  </label>
                  <select
                    required
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="" disabled>Select customer...</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} {c.phone ? `(${c.phone})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                  Spray / Chemical Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.spray}
                  onChange={(e) => setFormData({ ...formData, spray: e.target.value })}
                  placeholder="e.g. Copper Fungicide 50WP"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 25"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                    Unit Price (៛) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    placeholder="e.g. 50000"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Live calculated cost preview */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Calculation Preview:</span>
                <span className="font-bold text-lg text-emerald-400">
                  {calculatedTotal.toLocaleString()} ៛
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingSpray ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
