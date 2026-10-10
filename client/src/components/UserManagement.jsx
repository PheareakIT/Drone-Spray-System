import { useState } from 'react';
import { Shield, Plus, Search, Edit2, Trash2, Mail, UserCheck, AlertCircle } from 'lucide-react';
import { userApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function UserManagement({ users, onRefresh }) {
  const { user: currentUser } = useAuth();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ username: '', email: '', password: '', role: 'user' });
    setError('');
    setModalOpen(true);
  };

  const getEditStatus = (targetUser) => {
    // Admin cannot edit Super Admin accounts
    if (currentUser?.role === 'admin' && targetUser.role === 'super') {
      return { disabled: true, reason: t('adminCannotEditSuper') };
    }
    return { disabled: false, reason: t('btnEdit') };
  };

  const handleOpenEdit = (user) => {
    if (currentUser?.role === 'admin' && user.role === 'super') {
      alert(t('adminCannotEditSuper'));
      return;
    }
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // leave empty unless updating
      role: user.role,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { ...formData };
      if (editingUser && !payload.password) {
        delete payload.password; // don't overwrite password if untouched
      }

      if (editingUser) {
        await userApi.update(editingUser._id, payload);
      } else {
        await userApi.create(payload);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const getDeleteStatus = (targetUser) => {
    const currentUserId = String(currentUser?._id || currentUser?.id || '');
    const targetUserId = String(targetUser._id || targetUser.id || '');
    const isSelf = Boolean(currentUserId && targetUserId === currentUserId);

    // Rule 1: Super or Admin cannot delete own self -> disabled
    if (isSelf) {
      return { disabled: true, reason: t('cannotDeleteSelf') };
    }

    // Rule 2: Admin cannot delete other Admins or Supers -> disabled
    if (currentUser?.role === 'admin' && targetUser.role !== 'user') {
      return { disabled: true, reason: t('adminOnlyDeleteUsers') };
    }

    // Rule 3: Super can delete anyone else
    if (currentUser?.role === 'super') {
      return { disabled: false, reason: t('btnDelete') };
    }

    // Rule 4: Admin can delete users
    if (currentUser?.role === 'admin' && targetUser.role === 'user') {
      return { disabled: false, reason: t('btnDelete') };
    }

    return { disabled: true, reason: t('cannotDeleteSelf') };
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const currentUserId = String(currentUser?._id || currentUser?.id || '');
    if (String(deleteTarget.id) === currentUserId) {
      alert(t('cannotDeleteSelf'));
      setDeleteTarget(null);
      return;
    }
    if (currentUser?.role === 'admin' && deleteTarget.role !== 'user') {
      alert(t('adminOnlyDeleteUsers'));
      setDeleteTarget(null);
      return;
    }
    setIsDeleting(true);
    try {
      await userApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {t('superRole')}
          </span>
        );
      case 'admin':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {t('adminRole')}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
            {t('userRole')}
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
            <Shield className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">{t('userManagementTitle')}</h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {t('userManagementSub')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-500/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t('btnNewUser')}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchUser')}
          className="w-full pl-12 pr-4 py-3 bg-slate-800/90 border border-slate-700/60 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all"
        />
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl overflow-hidden shadow-xl">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">គ្មានទិន្នន័យ / No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-150">
              <thead>
                <tr className="border-b border-slate-700/60 bg-slate-900/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">{t('thUser')}</th>
                  <th className="py-3.5 px-6">{t('email')}</th>
                  <th className="py-3.5 px-6">{t('thRole')}</th>
                  <th className="py-3.5 px-6">{t('thCreated')}</th>
                  <th className="py-3.5 px-6 text-right">{t('thActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-300 font-bold flex items-center justify-center text-sm">
                          {u.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{u.username}</span>
                            {String(u._id || u.id) === String(currentUser?._id || currentUser?.id) && (
                              <span className="text-[10px] bg-slate-700 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                                ខ្ញុំ / YOU
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getRoleBadge(u.role)}</td>
                    <td className="py-4 px-6 text-slate-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        {(() => {
                          const editStatus = getEditStatus(u);
                          return (
                            <button
                              type="button"
                              disabled={editStatus.disabled}
                              onClick={() => {
                                if (!editStatus.disabled) {
                                  handleOpenEdit(u);
                                }
                              }}
                              className={`p-2 rounded-lg transition-all ${
                                editStatus.disabled
                                  ? 'bg-slate-800/40 text-slate-600 border border-slate-700/30 cursor-not-allowed opacity-40'
                                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white active:scale-95'
                              }`}
                              title={editStatus.reason}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          );
                        })()}
                        {(() => {
                          const status = getDeleteStatus(u);
                          return (
                            <button
                              type="button"
                              disabled={status.disabled}
                              onClick={() => {
                                if (!status.disabled) {
                                  setDeleteTarget({ id: u._id, username: u.username, role: u.role });
                                }
                              }}
                              className={`p-2 rounded-lg transition-all ${
                                status.disabled
                                  ? 'bg-slate-800/40 text-slate-600 border border-slate-700/30 cursor-not-allowed opacity-40'
                                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 active:scale-95'
                              }`}
                              title={status.reason}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          );
                        })()}
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
            <h3 className="text-xl font-bold text-white mb-1">
              {editingUser ? t('modalEditUser') : t('modalNewUser')}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              {t('userManagementSub')}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                  {t('username')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                  {editingUser ? t('passwordLeaveBlank') : `${t('password')} *`}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder={editingUser ? '••••••••' : t('passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wider">
                  {t('roleAssignment')}
                </label>
                <select
                  value={formData.role}
                  disabled={currentUser?.role !== 'super'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                >
                  <option value="user">{t('userRole')}</option>
                  {currentUser?.role === 'super' && (
                    <>
                      <option value="admin">{t('adminRole')}</option>
                      <option value="super">{t('superRole')}</option>
                    </>
                  )}
                </select>
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
                  className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {loading ? t('btnSaving') : t('btnSave')}
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
              {t('deleteUserTitle')}
            </h3>
            <p className="text-xs text-slate-400 text-center mb-6">
              {t('deleteUserDesc')}{' '}
              <span className="font-semibold text-white">"{deleteTarget.username}"</span>?{' '}
              {t('cannotUndo')}
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
