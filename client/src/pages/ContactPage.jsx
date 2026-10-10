import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Phone,
  Send,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  User,
} from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    topic: 'general',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        topic: 'general',
        message: '',
      });
    }, 700);
  };

  const contactCards = [
    {
      title: t('phoneHotline'),
      value: t('phoneHotlineNumber'),
      sub: 'រៀងរាល់ម៉ោងធ្វើការ',
      icon: Phone,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20 border-emerald-500/30',
      link: 'tel:+855816869014',
    },
    {
      title: t('telegramSupport'),
      value: t('telegramHandle'),
      sub: 'ឆ្លើយតបរហ័ស ២៤/៧',
      icon: Send,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/20 border-sky-500/30',
      link: 'https://t.me/Nary_drone',
    },
    {
      title: t('emailSupport'),
      value: t('emailAddressVal'),
      sub: 'សម្រាប់ការសាកសួរផ្លូវការ',
      icon: Mail,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/20 border-teal-500/30',
      link: 'mailto:supportTeam@gmail.com',
    },
    {
      title: t('locationTitle'),
      value: t('locationDesc'),
      sub: 'មជ្ឈមណ្ឌលផ្ទាល់',
      icon: MapPin,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20 border-amber-500/30',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/60 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Support & Consultation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
            {t('contactTitle')}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {t('contactSubtitle')}
          </p>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {contactCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all group"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${c.bgColor} border flex items-center justify-center ${c.color} mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-1">
                  {c.title}
                </h3>
                <p className="text-base font-bold text-white break-words">
                  {c.value}
                </p>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                {c.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Contact Form and Working Hours Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Working Hours & Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {t('workingHoursTitle')}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {t('workingHoursDesc')}
            </p>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400">
              💡 សម្រាប់ករណីសង្គ្រោះបន្ទាន់ ឬបញ្ហាជំងឺរាតត្បាតដំណាំធ្ងន់ធ្ងរ សូមទាក់ទងមកកាន់ Hotline ដោយផ្ទាល់។
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/90 border border-emerald-800/40 rounded-3xl p-6 sm:p-8">
            <h4 className="text-base font-bold text-white mb-2">
              ជំនួយការ ដ្រូនកសិកម្មព្រៃតូច
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              ប្រព័ន្ធរបស់យើងត្រូវបានបង្កើតឡើងដើម្បីបម្រើដល់កសិករ និងម្ចាស់ចម្ការទាំងអស់ ធានាឱ្យមានតម្លាភាពក្នុងការប្រើប្រាស់បរិមាណថ្នាំកសិកម្ម និងការទូទាត់ប្រាក់។
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-2 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {t('sendMessageTitle')}
              </h2>
              <p className="text-xs text-slate-400">
                {t('sendMessageSub')}
              </p>
            </div>
          </div>

          {submitted && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-sm animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-400" />
              <span>{t('messageSentSuccess')}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('fullName')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('fullNamePlaceholder')}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('phoneNumber')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('phonePlaceholder')}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {t('subjectTopic')}
              </label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                <option value="general">{t('topicGeneral')}</option>
                <option value="spray">{t('topicSprayService')}</option>
                <option value="billing">{t('topicBilling')}</option>
                <option value="technical">{t('topicTechnical')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {t('messageContent')}
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t('messagePlaceholder')}
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('btnSendMessage')}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
