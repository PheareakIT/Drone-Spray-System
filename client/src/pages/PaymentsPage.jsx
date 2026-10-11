import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  User,
  Calendar,
  Layers,
  ArrowRightCircle,
  PieChart,
  PlusCircle,
  X,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { sprayApi } from '../api/client';

export default function PaymentsPage({ sprays = [], customers = [], onRefresh }) {
  const { t, formatRiel } = useLanguage();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Quick Payment modal
  const [payModalItem, setPayModalItem] = useState(null);
  const [paymentInput, setPaymentInput] = useState('');

  // Verify Full Payment modal
  const [verifyFullPayItem, setVerifyFullPayItem] = useState(null);

  // Success notification banner/toast
  const [successNotice, setSuccessNotice] = useState(null);

  useEffect(() => {
    if (successNotice) {
      const timer = setTimeout(() => setSuccessNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successNotice]);

  // Financial aggregates
  const totalBilled = sprays.reduce(
    (acc, curr) => acc + (curr.quantity * curr.unitPrice || 0),
    0
  );

  const totalCollected = sprays.reduce(
    (acc, curr) => acc + (curr.paidAmount || 0),
    0
  );

  const totalOutstanding = Math.max(0, totalBilled - totalCollected);

  const partialCount = sprays.filter(
    (s) => s.paymentStatus === 'partial'
  ).length;

  const filteredItems = sprays.filter((item) => {
    const status = item.paymentStatus || 'pending';
    const matchesStatus = !filterStatus || status === filterStatus;
    const matchesCustomer =
      !customerFilter || item.customer?._id === customerFilter;
    const matchesSearch =
      item.spray?.toLowerCase().includes(search.toLowerCase()) ||
      item.customer?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesCustomer && matchesSearch;
  });

  const handleSettleFull = async (item) => {
    if (!item) return;
    setUpdatingId(item._id);
    const total = item.quantity * item.unitPrice;
    const remaining = Math.max(0, total - (item.paidAmount || 0));
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
      if (payModalItem?._id === item._id) setPayModalItem(null);
      setVerifyFullPayItem(null);
      setSuccessNotice({
        customer: item.customer?.name || '',
        amount: formatRiel(remaining),
      });
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update payment');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePayModalSubmit = async (e) => {
    e.preventDefault();
    if (!payModalItem) return;

    const total = (Number(payModalItem.quantity) || 0) * (Number(payModalItem.unitPrice) || 0);
    const currentPaid = Number(payModalItem.paidAmount) || 0;
    const remaining = Math.max(0, total - currentPaid);
    const added = Number(paymentInput) || 0;

    if (added > remaining) {
      alert(`${t('errPaymentExceedsDue')} (${formatRiel(remaining)})`);
      return;
    }

    setUpdatingId(payModalItem._id);
    try {
      const newPaid = currentPaid + added;

      await sprayApi.update(payModalItem._id, {
        date: payModalItem.date,
        customer: payModalItem.customer?._id || payModalItem.customer,
        spray: payModalItem.spray,
        quantity: payModalItem.quantity,
        unitPrice: payModalItem.unitPrice,
        paidAmount: newPaid,
      });

      setPayModalItem(null);
      setPaymentInput('');
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to record payment');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (item) => {
    const status = item.paymentStatus || 'pending';
    const total = item.quantity * item.unitPrice;
    const paid = item.paidAmount || 0;
    const remaining = Math.max(0, total - paid);

    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('statusPaid')}</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <PieChart className="w-3.5 h-3.5 text-sky-400" />
            <span>{t('statusPartial')} ({formatRiel(remaining)} {t('leftDue')})</span>
          </span>
        );
      case 'unpaid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>{t('statusUnpaid')}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
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
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">{t('paymentsTitle')}</h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {t('paymentsSubtitle')}
          </p>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('totalBilled')}</span>
            <div className="w-8 h-8 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{formatRiel(totalBilled)}</div>
          <p className="text-xs text-slate-400 mt-1">{t('sessionsRecorded')}</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('collectedCash')}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{formatRiel(totalCollected)}</div>
          <p className="text-xs text-emerald-500/80 mt-1">
            {totalBilled > 0 ? `${((totalCollected / totalBilled) * 100).toFixed(1)}% ${t('collectedCash')}` : '0%'}
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('outstandingDue')}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400">{formatRiel(totalOutstanding)}</div>
          <p className="text-xs text-amber-500/80 mt-1">{t('receivablesRemaining')}</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{t('partialAccounts')}</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-400">{partialCount}</div>
          <p className="text-xs text-sky-400/80 mt-1">{t('partiallyPaidJobs')}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
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
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
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
          <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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

      {/* Payments Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl overflow-hidden shadow-xl">
        {filteredItems.length === 0 ? (
          <div className="text-center py-14 px-4">
            <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">មិនមានកំណត់ត្រាទូទាត់ឡើយ</p>
            <p className="text-slate-500 text-xs mt-1">សូមសាកល្បងកែសម្រួលលក្ខខណ្ឌស្វែងរក</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead>
                <tr className="border-b border-slate-700/60 bg-slate-900/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">{t('thCustomer')} & {t('thChemical')}</th>
                  <th className="py-3.5 px-6">{t('thInvoiceTotal')}</th>
                  <th className="py-3.5 px-6">{t('cashCollected')} / {t('dueBalance')}</th>
                  <th className="py-3.5 px-6">{t('progress')}</th>
                  <th className="py-3.5 px-6">{t('thStatus')}</th>
                  <th className="py-3.5 px-6 text-right">{t('thActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-sm">
                {filteredItems.map((item) => {
                  const total = item.quantity * item.unitPrice;
                  const paid = item.paidAmount || 0;
                  const remaining = Math.max(0, total - paid);
                  const percent = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;

                  return (
                    <tr key={item._id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white">
                          {item.customer?.name || 'Customer Deleted'}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-emerald-400">{item.spray}</span>
                          <span>• {new Date(item.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-white text-base">
                        {formatRiel(total)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-emerald-400 font-semibold">{formatRiel(paid)}</div>
                        {remaining > 0 ? (
                          <div className="text-xs text-amber-400 font-medium">{formatRiel(remaining)} {t('leftDue')}</div>
                        ) : (
                          <div className="text-xs text-slate-500">{t('fullySettled')}</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="w-36">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>{percent}%</span>
                            <span>{remaining === 0 ? 'រួចរាល់' : formatRiel(remaining)}</span>
                          </div>
                          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${percent === 100
                                  ? 'bg-emerald-400'
                                  : percent > 0
                                    ? 'bg-sky-400'
                                    : 'bg-slate-600'
                                }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(item)}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          {remaining > 0 && (
                            <>
                              <button
                                onClick={() => {
                                  setPayModalItem(item);
                                  setPaymentInput('');
                                }}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                              >
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>{t('btnRecordPayment')}</span>
                              </button>
                              <button
                                onClick={() => setVerifyFullPayItem(item)}
                                className="px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                              >
                                {t('btnPayFull')}
                              </button>
                            </>
                          )}
                          {remaining === 0 && (
                            <span className="text-xs text-emerald-400 font-medium">✓ {t('fullySettled')}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Dialog */}
      {payModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>{t('quickPayTitle')}</span>
              </h3>
              <button
                onClick={() => setPayModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {t('quickPayDesc')} <span className="font-semibold text-white">{payModalItem.customer?.name}</span>
            </p>

            {(() => {
              const total = payModalItem.quantity * payModalItem.unitPrice;
              const paid = payModalItem.paidAmount || 0;
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

                  <form onSubmit={handlePayModalSubmit} className="space-y-4">
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
                        value={paymentInput}
                        onChange={(e) => setPaymentInput(e.target.value)}
                        placeholder={`e.g. ${remaining}`}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base"
                      />
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={updatingId === payModalItem._id}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-colors"
                      >
                        {updatingId === payModalItem._id ? t('btnSaving') : t('btnRecordPayment')}
                      </button>

                      <button
                        type="button"
                        onClick={() => setVerifyFullPayItem(payModalItem)}
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

      {/* Verify Full Payment Modal */}
      {verifyFullPayItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700/80 rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => !updatingId && setVerifyFullPayItem(null)}
              disabled={!!updatingId}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Icon */}
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-7 h-7" />
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-xl font-bold text-white text-center mb-1">
              {t('confirmPayFullTitle')}
            </h3>
            <p className="text-xs text-slate-400 text-center mb-5">
              {t('confirmPayFullDesc')}{' '}
              <span className="font-bold text-white">
                "{verifyFullPayItem.customer?.name || 'Customer'}"
              </span>?
            </p>

            {/* Summary Breakdown Card */}
            {(() => {
              const total = verifyFullPayItem.quantity * verifyFullPayItem.unitPrice;
              const paid = verifyFullPayItem.paidAmount || 0;
              const remaining = Math.max(0, total - paid);

              return (
                <div className="space-y-4">
                  <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700/70 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>{t('thCustomer')}:</span>
                      <span className="font-semibold text-white">{verifyFullPayItem.customer?.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>{t('fieldSprayName')}:</span>
                      <span className="text-emerald-400 font-medium">{verifyFullPayItem.spray}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>{t('totalInvoice')}:</span>
                      <span className="font-mono text-slate-200">{formatRiel(total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>{t('alreadyCollected')}:</span>
                      <span className="font-mono text-slate-400">{formatRiel(paid)}</span>
                    </div>

                    <div className="border-t border-slate-800 pt-2.5 flex justify-between items-center">
                      <span className="font-semibold text-amber-300">{t('confirmPayFullAmount')}</span>
                      <span className="text-base font-bold text-emerald-400 font-mono">
                        {formatRiel(remaining)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{t('confirmPayFullNote')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={!!updatingId}
                      onClick={() => setVerifyFullPayItem(null)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-700/70 hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      {t('btnCancel')}
                    </button>
                    <button
                      type="button"
                      disabled={!!updatingId}
                      onClick={() => handleSettleFull(verifyFullPayItem)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                    >
                      {updatingId === verifyFullPayItem._id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{t('btnSaving')}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t('btnConfirmPayFull')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Success Notification Toast */}
      {successNotice && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl shadow-emerald-500/10 flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-top-3 fade-in duration-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white">{t('payFullSuccess')}</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              <span className="font-semibold text-white">{successNotice.customer}</span> • {successNotice.amount}
            </p>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
