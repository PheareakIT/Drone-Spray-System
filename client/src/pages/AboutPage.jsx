import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Droplets,
  ShieldCheck,
  Target,
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Clock,
  Layers,
  HeartHandshake,
} from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();

  const features = [
    {
      title: t('feature1Title'),
      desc: t('feature1Desc'),
      icon: Droplets,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      textGrad: 'text-emerald-400',
    },
    {
      title: t('feature2Title'),
      desc: t('feature2Desc'),
      icon: Layers,
      gradient: 'from-teal-500/20 to-cyan-500/10',
      border: 'border-teal-500/30',
      textGrad: 'text-teal-400',
    },
    {
      title: t('feature3Title'),
      desc: t('feature3Desc'),
      icon: Award,
      gradient: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/30',
      textGrad: 'text-amber-400',
    },
    {
      title: t('feature4Title'),
      desc: t('feature4Desc'),
      icon: ShieldCheck,
      gradient: 'from-blue-500/20 to-indigo-500/10',
      border: 'border-blue-500/30',
      textGrad: 'text-blue-400',
    },
  ];

  const standards = [
    t('standardItem1'),
    t('standardItem2'),
    t('standardItem3'),
    t('standardItem4'),
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-900/90 to-emerald-950/60 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ដ្រូនកសិកម្មព្រៃតូច</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            {t('aboutTitle')}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {t('aboutSubtitle')}
          </p>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-emerald-500/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">
            {t('aboutMissionTitle')}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t('aboutMissionDesc')}
          </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-teal-500/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-5">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">
            {t('aboutVisionTitle')}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t('aboutVisionDesc')}
          </p>
        </div>
      </div>

      {/* Core Platform Pillars */}
      <div>
        <div className="text-center sm:text-left mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            ប្រព័ន្ធស្នូលនៃ ដ្រូនកសិកម្មព្រៃតូច
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            សមត្ថភាព និងមុខងារសំខាន់ៗដែលជួយសម្រួលដល់ការគ្រប់គ្រងចម្ការ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-6 bg-slate-900/70 border ${feat.border} bg-linear-to-b ${feat.gradient} backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200`}
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center ${feat.textGrad} mb-4 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standards & Safety Checklist */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {t('standardsTitle')}
            </h2>
            <p className="text-xs text-slate-400">
              ការប្តេជ្ញាចិត្តចំពោះគុណភាពកសិកម្ម និងសុវត្ថិភាពសហគមន៍
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {standards.map((std, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-750"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-200">{std}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to Contact */}
      <div className="rounded-3xl bg-linear-to-r from-emerald-600 to-teal-600 p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-950/40">
        <div>
          <h3 className="text-2xl font-extrabold tracking-tight mb-2">
            ត្រូវការជំនួយ ឬចង់សាកសួរព័ត៌មានបន្ថែម?
          </h3>
          <p className="text-emerald-100 text-sm max-w-xl">
            ក្រុមការងារប្រតិបត្តិការបាញ់ថ្នាំ ដ្រូនកសិកម្មព្រៃតូច រីករាយស្វាគមន៍រាល់ចម្ងល់ និងការស្នើសុំសេវាកម្មរបស់លោកអ្នក។
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm hover:bg-emerald-50 transition-all shadow-lg active:scale-95 shrink-0"
        >
          <PhoneCall className="w-4 h-4 text-emerald-600" />
          <span>{t('navContact')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
