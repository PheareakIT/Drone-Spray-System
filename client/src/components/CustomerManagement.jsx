import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Users, Plus, Search, Edit2, Trash2, Phone, User, AlertCircle, CheckCircle } from 'lucide-react';
import { customerApi } from '../api/client';

export default function CustomerManagement({ customers, onRefresh }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '' });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({ name: customer.name, phone: customer.phone || '' });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingCustomer) {
        await customerApi.update(editingCustomer._id, formData);
      } else {
        await customerApi.create(formData);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await customerApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete customer');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/60 p-5 sm:p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">{t('customerDirectory')}</h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {t('customerDirectorySub')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t('btnAddCustomer')}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchCustomer')}
          className="w-full pl-12 pr-4 py-3 bg-slate-800/90 border border-slate-700/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
        />
      </div>

      {/* Customers List / Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl overflow-hidden shadow-xl">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">មិនមានអតិថិជនឡើយ</p>
            <p className="text-slate-500 text-xs mt-1">
              {search ? 'សូមសាកល្បងកែប្រែពាក្យស្វែងរក' : 'ចុច "បន្ថែមអតិថិជន" ដើម្បីចាប់ផ្តើម'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-137.5">
              <thead>
                <tr className="border-b border-slate-700/60 bg-slate-900/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">{t('thCustomer')}</th>
                  <th className="py-3.5 px-6">{t('thPhone')}</th>
                  <th className="py-3.5 px-6">{t('thCreated')}</th>
                  <th className="py-3.5 px-6 text-right">{t('thActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-sm">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                          {customer.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{customer.name}</div>
                          <div className="text-xs text-slate-400">ID: {customer._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {customer.phone ? (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Phone className="w-4 h-4 text-emerald-400/80" />
                          <span>{customer.phone}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">{t('noPhone')}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-xs">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(customer)}
                          className="p-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title={t('btnEdit')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ id: customer._id, name: customer.name })}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                          title={t('btnDelete')}
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
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-white mb-2">
              {editingCustomer ? t('modalEditCustomer') : t('modalNewCustomer')}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              បំពេញព័ត៌មានអតិថិជនកសិដ្ឋានខាងក្រោម
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                  {t('customerName')}
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ឧ. ចម្ការទុរេន សុខសាន្ត"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                  {t('customerPhone')}
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="ឧ. 012 345 678"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  {t('btnCancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {loading ? t('btnSaving') : editingCustomer ? t('btnSave') : t('btnAddCustomer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-1">
              {t('deleteCustomerTitle')}
            </h3>
            <p className="text-xs text-slate-400 text-center mb-6">
              {t('deleteCustomerDesc')} <span className="font-semibold text-white">"{deleteTarget.name}"</span>? {t('cannotUndo')}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-700/60 hover:bg-slate-700 transition-colors"
              >
                {t('btnCancel')}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                {isDeleting ? t('btnDeleting') : t('btnConfirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
