'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  CheckSquare,
  BarChart3,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Globe,
  Clock,
  ChevronRight,
  MousePointer2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();

  const features = [
    {
      title: 'Smart Task Management',
      description: 'Organize, assign, and track tasks with intuitive drag-and-drop workflows and real-time updates through SignalR.',
      icon: CheckSquare,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      title: 'Advanced Analytics',
      description: 'Get deep insights into team performance and task trends with powerful visual reports and Python-powered AI insights.',
      icon: BarChart3,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    },
    {
      title: 'Role-Based Security',
      description: 'Enterprise-grade security with JWT authentication and granular role-based access control (RBAC).',
      icon: Shield,
      color: 'text-rose-400',
      bg: 'bg-rose-400/10'
    },
    {
      title: 'Real-time Collaboration',
      description: 'Sync your team across the globe with instant notifications and collaborative task tracking.',
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Project Manager at TechFlow',
      content: 'The real-time updates and analytics have completely transformed how we track our quarterly goals. A game changer for enterprise teams.',
      image: 'https://i.pravatar.cc/150?u=sarah'
    },
    {
      name: 'Michael Chen',
      role: 'CTO at CloudScale',
      content: 'Security was our top priority, and TMS delivered perfect RBAC implementation. The API integration is seamless and powerful.',
      image: 'https://i.pravatar.cc/150?u=michael'
    }
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-slate-200 selection:bg-violet-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <CheckSquare className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Enterprise TMS</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#analytics" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Analytics</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Testimonials</a>
            {user ? (
              <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20">
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign In</Link>
                <Link href="/register" className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl font-semibold border border-white/10 transition-all">
                  Join for Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[700px] bg-blue-500/10 blur-[150px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Zap className="w-3 h-3 fill-current" />
              Trusted by 500+ Enterprises Globaly
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[1] mb-8">
              Supercharge Your <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-rose-400 bg-clip-text text-transparent">Execution Velocity</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Experience the future of project management. A unified platform where high-performance teams orchestrate tasks with precision, security, and real-time intelligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/register" className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-[0_0_30px_rgba(124,58,237,0.3)] active:scale-95">
                Elevate Your Team <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-xl border border-white/10 transition-all hover:border-white/20">
                Register Now
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative w-full max-w-6xl"
          >
            <div className="relative rounded-[3rem] border border-white/10 p-3 bg-white/5 backdrop-blur-md shadow-2xl">
              <img
                src="/hero.png"
                alt="Dashboard Preview"
                className="w-full h-auto rounded-[2.5rem] border border-white/10 shadow-2xl"
              />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-fuchsia-500/20 blur-[100px] -z-10 rounded-full" />
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-violet-500/20 blur-[100px] -z-10 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 border-y border-white/5 relative bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-[0.2em] mb-12">Empowering teams at world-class companies</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale contrast-125">
            <span className="text-3xl font-black text-white italic">NEXUS</span>
            <span className="text-3xl font-black text-white tracking-widest">QUANTUM</span>
            <span className="text-3xl font-black text-white">ORBITAL</span>
            <span className="text-3xl font-black text-white lowercase">synapse.</span>
            <span className="text-3xl font-black text-white uppercase tracking-tighter">PRIME</span>
          </div>
        </div>
      </section>

      {/* Visual Feature 1 */}
      <section id="features" className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Collaborative Task Orchestration</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Break down silos and align your team in a unified workspace. Our intuitive interface allows you to manage lifecycle of complex projects with simple yet powerful drag-and-drop operations, real-time status updates, and granular assignment controls.
            </p>
            <div className="space-y-6">
              {[
                'Instant SignalR powered notifications',
                'Advanced filtering and categorization',
                'Resource workload balancing',
                'Automated status transitions'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="/collaboration.png"
              alt="Collaboration"
              className="rounded-[3rem] shadow-2xl border border-white/10"
            />
          </motion.div>
        </div>
      </section>

      {/* Visual Feature 2 */}
      <section id="analytics" className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
            <div className="bg-[#0f172a] rounded-[3rem] p-8 border border-white/10 shadow-2xl relative">
              <div className="h-4 w-4 rounded-full bg-rose-500 absolute top-8 left-8" />
              <div className="h-4 w-4 rounded-full bg-amber-500 absolute top-8 left-16" />
              <div className="h-4 w-4 rounded-full bg-emerald-500 absolute top-8 left-24" />
              <div className="mt-12 space-y-6">
                <div className="h-8 w-3/4 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-40 w-full bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-end p-4 gap-2">
                  {[40, 70, 45, 90, 65, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-500/40 rounded-t-lg" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-white/5 rounded-xl" />
                  <div className="h-20 bg-white/5 rounded-xl" />
                  <div className="h-20 bg-white/5 rounded-xl" />
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Data-Driven Intelligence</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Transform raw activity into actionable insights. Our Python-powered analytics engine processes thousands of data points to give you a clear view of completion rates, bottleneck analysis, and resource optimization.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Sync Accuracy</div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-white mb-2">-34%</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Project Lead Time</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visual Feature 3 */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Fortress Level Security</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Your data is your most valuable asset. TMS provides military-grade security with JWT encrypted sessions, strictly enforced Role-Based Access Control, and regular audit logs. Rest easy knowing your intellectual property is guarded 24/7.
            </p>
            <ul className="space-y-4">
              {['JWT Encrypted Endpoints', 'Granular Role Definitions', 'Audit Logging & Compliance', 'SQL Injection Protection'].map(t => (
                <li key={t} className="flex items-center gap-3 text-slate-300">
                  <Shield className="w-5 h-5 text-rose-500" />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="/security.png"
              alt="Security"
              className="rounded-[3rem] shadow-2xl border border-white/10"
            />
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for High Stakes</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Leading teams rely on Enterprise TMS to deliver multi-million dollar projects on schedule.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[3rem] relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] group-hover:bg-blue-500/20 transition-all" />
                <p className="text-xl text-slate-300 italic mb-10 relative">"{t.content}"</p>
                <div className="flex items-center gap-5">
                  <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full border-2 border-white/10" />
                  <div>
                    <div className="font-bold text-white text-lg">{t.name}</div>
                    <div className="text-blue-500 text-sm font-semibold">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[4rem] bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-12 md:p-24 overflow-hidden text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 blur-[130px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-fuchsia-400/10 blur-[100px] rounded-full" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[0.9]">
                The Future of <br /> Work is Here.
              </h2>
              <p className="text-slate-400 text-xl mb-14 max-w-2xl mx-auto leading-relaxed">
                Join the league of elite organizations. Start your free enterprise trial today and see the difference precision makes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/register" className="w-full sm:w-auto bg-white text-blue-700 px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl shadow-black/20 hover:scale-105 active:scale-95">
                  Get Started for Free
                </Link>
                <Link href="/login" className="w-full sm:w-auto text-white font-bold text-xl flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
                  View Pricing <ChevronRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                <CheckSquare className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">TMS ENTERPRISE</span>
            </div>
            <p className="text-slate-500 leading-relaxed mb-8">
              Pioneering the next era of organizational efficiency and team orchestration through cutting-edge technology and human-centric design.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all" />)}
            </div>
          </div>

          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-widest text-xs">Innovation</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><a href="#" className="hover:text-blue-400 transition-colors">SignalR Hub</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">FastAPI Analytics</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">RBAC Governance</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">OpenAPI Spec</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Technical Docs</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Keys</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">System Support</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Community</a></li>
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
            <h4 className="text-white font-black mb-6">Stay Ahead</h4>
            <p className="text-slate-500 text-sm mb-6">Subscribe for deep dives into team productivity research.</p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Work Email"
                className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full transition-all"
              />
              <button className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl text-white font-bold w-full transition-all flex items-center justify-center gap-2 group">
                Subscribe <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-600 text-xs font-bold uppercase tracking-widest">
          <div>© 2026 PRIME LABS GROUP. ALL SYSTEMS OPERATIONAL.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Architecture</a>
            <a href="#" className="hover:text-white transition-colors">Global Compliance</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
