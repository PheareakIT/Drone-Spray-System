import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Droplets,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRightCircle,
  PieChart,
  CreditCard,
  X,
} from 'lucide-react';
import { sprayApi } from '../api/client';

export default function SpraysPage({ sprays = [], customers = [], onRefresh }) {
  const location = useLocation();
  const { t, formatRiel } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpray, setEditingSpray] = useState(null);

  // Quick Payment Modal state
  const [quickPayItem, setQuickPayItem] = useState(null);
  const [quickPayAmount, setQuickPayAmount] = useState('');
  const [quickPayLoading, setQuickPayLoading] = useState(false);

  // Delete Confirmation Modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customer: '',
    spray: '',
    quantity: '',
    unitPrice: '',
    paidAmount: '',
    paymentStatus: 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-open modal if query param passed
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openModal') === 'true') {
      handleOpenAdd();
    }
  }, [location.search, customers]);

  // Filtering
  const filteredSprays = sprays.filter((item) => {
    const matchesSearch =
      item.spray?.toLowerCase().includes(search.toLowerCase()) ||
      item.customer?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCustomer =
      !selectedCustomerFilter || item.customer?._id === selectedCustomerFilter;
    const matchesPayment =
      !paymentFilter || (item.paymentStatus || 'pending') === paymentFilter;
    return matchesSearch && matchesCustomer && matchesPayment;
  });

  const handleOpenAdd = () => {
    setEditingSpray(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      customer: customers[0]?._id || '',
      spray: '',
      quantity: '',
      unitPrice: '',
      paidAmount: '0',
      paymentStatus: 'pending',
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
      paidAmount: item.paidAmount !== undefined ? item.paidAmount : 0,
      paymentStatus: item.paymentStatus || 'pending',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer) {
      setError(t('selectCustomerPlaceholder'));
      return;
    }

    const calculatedTotal = (Number(formData.quantity) || 0) * (Number(formData.unitPrice) || 0);
    const paidInput = Number(formData.paidAmount) || 0;
    if (paidInput > calculatedTotal) {
      setError(`${t('errPaymentExceedsTotal')} (${formatRiel(calculatedTotal)})`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
        paidAmount: Number(formData.paidAmount) || 0,
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

  // Quick Payment submission
  const handleQuickPaySubmit = async (e) => {
    e.preventDefault();
    if (!quickPayItem) return;

    const total = (Number(quickPayItem.quantity) || 0) * (Number(quickPayItem.unitPrice) || 0);
    const currentPaid = Number(quickPayItem.paidAmount) || 0;
    const remaining = Math.max(0, total - currentPaid);
    const added = Number(quickPayAmount) || 0;

    if (added > remaining) {
      alert(`${t('errPaymentExceedsDue')} (${formatRiel(remaining)})`);
      return;
    }

    setQuickPayLoading(true);
    try {
      const newPaid = currentPaid + added;

      await sprayApi.update(quickPayItem._id, {
        date: quickPayItem.date,
        customer: quickPayItem.customer?._id || quickPayItem.customer,
        spray: quickPayItem.spray,
        quantity: quickPayItem.quantity,
        unitPrice: quickPayItem.unitPrice,
        paidAmount: newPaid,
      });

      setQuickPayItem(null);
      setQuickPayAmount('');
      onRefresh();
    } catch (err) {
      alert(err.message || 'Payment update failed');
    } finally {
      setQuickPayLoading(false);
    }
  };

  const handleQuickSettleFull = async (item) => {
    const total = item.quantity * item.unitPrice;
    try {
      await sprayApi.update(item._id, {
        date: item.date,
        customer: item.customer?._id || item.customer,
        spray: item.spray,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        paidAmount: total,
        paymentStatus: 'paid',
      });
      if (quickPayItem?._id === item._id) setQuickPayItem(null);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to settle balance');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await sprayApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete record');
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculations for form preview
  const formTotal = (Number(formData.quantity) || 0) * (Number(formData.unitPrice) || 0);
  const formPaid = Number(formData.paidAmount) || 0;
  const formRemaining = Math.max(0, formTotal - formPaid);

  const getStatusBadge = (item) => {
    const status = item.paymentStatus || 'pending';
    const total = item.quantity * item.unitPrice;
    const paid = item.paidAmount || 0;
    const remaining = Math.max(0, total - paid);

    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('statusPaid')}</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <PieChart className="w-3.5 h-3.5 text-sky-400" />
            <span>{t('statusPartial')} ({formatRiel(remaining)} {t('leftDue')})</span>
          </span>
        );
      case 'unpaid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>{t('statusUnpaid')}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('statusPending')}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/60 p-5 sm:p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">{t('navSprays')}</h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {t('recentApplicationsSubtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t('btnNewSpray')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchSprayCustomer')}
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
            <option value="">{t('filterAllCustomers')}</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-3 bg-slate-800/90 border border-slate-700/60 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">{t('filterAllStatuses')}</option>
            <option value="paid">{t('filterPaidOnly')}</option>
            <option value="partial">{t('filterPartialOnly')}</option>
            <option value="pending">{t('filterPendingOnly')}</option>
            <option value="unpaid">{t('filterUnpaidOnly')}</option>
          </select>
        </div>
      </div>

      {/* Spray Records Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl overflow-hidden shadow-xl">
        {filteredSprays.length === 0 ? (
          <div className="text-center py-14 px-4">
            <Droplets className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">{t('noSpraysYet')}</p>
            <p className="text-slate-500 text-xs mt-1">
              {search || selectedCustomerFilter || paymentFilter
                ? 'សូមកែសម្រួលលក្ខខណ្ឌស្វែងរករបស់អ្នក'
                : t('recordFirstSpray')}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (Visible on mobile screens < md) */}
            <div className="md:hidden divide-y divide-slate-700/50">
              {filteredSprays.map((item) => {
                const total = item.quantity * item.unitPrice;
                const paid = item.paidAmount || 0;
                const remaining = Math.max(0, total - paid);

                return (
                  <div key={item._id} className="p-4 space-y-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white text-base">
                          {item.customer?.name || 'Customer Deleted'}
                        </div>
                        {item.customer?.phone && (
                          <div className="text-xs text-slate-400">{item.customer.phone}</div>
                        )}
                      </div>
                      <div>{getStatusBadge(item)}</div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-medium border border-emerald-500/20">
                        {item.spray}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px] uppercase tracking-wider">{t('fieldQuantity').replace('*', '').trim()}</span>
                        <span className="font-semibold text-slate-200 text-sm">
                          {item.quantity} {t('unitHectare') || 'ហិចតា'}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">@ {formatRiel(item.unitPrice)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[11px] uppercase tracking-wider">{t('totalCalculated')}</span>
                        <span className="font-extrabold text-white text-base">
                          {formatRiel(total)}
                        </span>
                        <div className="text-[11px] mt-0.5 space-y-0.5">
                          <span className="text-emerald-400 block">{t('cashCollected')}: {formatRiel(paid)}</span>
                          {remaining > 0 && (
                            <span className="text-rose-400 font-medium block">{t('leftDue')}: {formatRiel(remaining)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {item.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => {
                            setQuickPayItem(item);
                            setQuickPayAmount('');
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30 transition-all min-h-[38px]"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{t('btnPay')}</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="py-2 px-3.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[38px]"
                        title={t('btnEdit')}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>{t('btnEdit')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            id: item._id,
                            name: item.spray,
                            customer: item.customer?.name,
                          })
                        }
                        className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 text-rose-400 transition-all min-h-[38px]"
                        title={t('btnDelete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Hidden on mobile < md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[820px]">
                <thead>
                  <tr className="border-b border-slate-700/60 bg-slate-900/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">{t('thDate')}</th>
                    <th className="py-3.5 px-6">{t('thCustomer')}</th>
                    <th className="py-3.5 px-6">{t('thChemical')}</th>
                    <th className="py-3.5 px-6">{t('thQtyPrice')}</th>
                    <th className="py-3.5 px-6">{t('thTotalPaid')}</th>
                    <th className="py-3.5 px-6">{t('thStatus')}</th>
                    <th className="py-3.5 px-6 text-right">{t('thActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40 text-sm">
                  {filteredSprays.map((item) => {
                    const total = item.quantity * item.unitPrice;
                    const paid = item.paidAmount || 0;
                    const remaining = Math.max(0, total - paid);

                    return (
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
                        <td className="py-4 px-6 text-slate-300">
                          <div>{item.quantity} {t('unitHectare') || 'ហិចតា'}</div>
                          <div className="text-xs text-slate-400">@ {formatRiel(item.unitPrice)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-white text-base">
                            {formatRiel(total)}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className="text-emerald-400">{t('cashCollected')}: {formatRiel(paid)}</span>
                            {remaining > 0 && (
                              <span className="text-rose-400 font-medium">| {t('leftDue')}: {formatRiel(remaining)}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">{getStatusBadge(item)}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            {item.paymentStatus !== 'paid' && (
                              <button
                                onClick={() => {
                                  setQuickPayItem(item);
                                  setQuickPayAmount('');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-medium text-xs flex items-center gap-1 transition-colors"
                                title={t('btnRecordPayment')}
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>{t('btnPay')}</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title={t('btnEdit')}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteTarget({
                                  id: item._id,
                                  name: item.spray,
                                  customer: item.customer?.name,
                                })
                              }
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                              title={t('btnDelete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-1">
              {editingSpray ? t('modalEditSprayTitle') : t('modalNewSprayTitle')}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              {t('modalSprayDesc')}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                    {t('fieldDate')}
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
                    {t('fieldCustomer')}
                  </label>
                  <select
                    required
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="" disabled>{t('selectCustomerPlaceholder')}</option>
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
                  {t('fieldSprayName')}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                    {t('fieldQuantity')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="10"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                    {t('fieldUnitPrice')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    placeholder="25000"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                    {t('fieldPaidAmount')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formTotal > 0 ? formTotal : undefined}
                    step="any"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                    placeholder="100"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Dynamic Payment Calculation Summary */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>{t('totalCalculated')}</span>
                  <span className="font-bold text-white">{formatRiel(formTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{t('paidReceived')}</span>
                  <span className="font-bold text-emerald-400">{formatRiel(formPaid)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                  <span className="text-slate-400">{t('remainingDue')}</span>
                  <span className={formRemaining > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                    {formatRiel(formRemaining)}
                  </span>
                </div>
                <div className="text-xs text-slate-400 pt-1">
                  <span>{t('autoStatus')} </span>
                  <span className="font-semibold text-white uppercase">
                    {formPaid >= formTotal && formTotal > 0
                      ? t('statusPaid')
                      : formPaid > 0
                      ? `${t('statusPartial')} (${formatRiel(formRemaining)} ${t('leftDue')})`
                      : t('statusPending')}
                  </span>
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
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {loading ? t('btnSaving') : editingSpray ? t('btnSave') : t('btnNewSpray')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Payment Modal */}
      {quickPayItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>{t('quickPayTitle')}</span>
              </h3>
              <button
                onClick={() => setQuickPayItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {t('quickPayDesc')} <span className="font-semibold text-white">{quickPayItem.customer?.name}</span> ({quickPayItem.spray})
            </p>

            {(() => {
              const total = quickPayItem.quantity * quickPayItem.unitPrice;
              const paid = quickPayItem.paidAmount || 0;
              const remaining = Math.max(0, total - paid);

              return (
                <div className="space-y-4">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700 space-y-1.5 text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>{t('totalInvoice')}</span>
                      <span className="font-bold text-white">{formatRiel(total)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t('alreadyCollected')}</span>
                      <span className="font-bold text-emerald-400">{formatRiel(paid)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                      <span className="text-amber-400">{t('currentBalanceDue')}</span>
                      <span className="text-amber-400">{formatRiel(remaining)}</span>
                    </div>
                  </div>

                  <form onSubmit={handleQuickPaySubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                        {t('amountPaidToday')}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={remaining}
                        step="any"
                        required
                        value={quickPayAmount}
                        onChange={(e) => setQuickPayAmount(e.target.value)}
                        placeholder={`e.g. ${remaining}`}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base"
                      />
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={quickPayLoading}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-colors"
                      >
                        {quickPayLoading ? t('btnSaving') : t('btnRecordPayment')}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickSettleFull(quickPayItem)}
                        className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl transition-colors"
                      >
                        {t('btnSettleFull')} ({formatRiel(remaining)})
                      </button>
                    </div>
                  </form>
                </div>
              );
            })()}
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
              {t('deleteSprayTitle')}
            </h3>
            <p className="text-xs text-slate-400 text-center mb-6">
              {t('deleteSprayDesc')} <span className="font-semibold text-white">"{deleteTarget.name}"</span>
              {deleteTarget.customer ? ` (${deleteTarget.customer})` : ''}? {t('cannotUndo')}
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
