import { Link } from "react-router-dom";
import { useState } from "react";
import {
  CheckCircle2, FolderKanban, MessageSquare, FileText,
  BarChart3, Shield, Zap, Menu, X, Star,
  ArrowRight, Globe, Lock, TrendingUp, Clock
} from "lucide-react";
import logo from "../assets/logo.png";

const NAV_LINKS = ["Features", "Roles", "Testimonials", "Pricing"];

const STATS = [
  { value: "50,000+", label: "Teams worldwide" },
  { value: "2.4M", label: "Tasks completed" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9★", label: "Average rating" },
];

const FEATURES = [
  {
    icon: FolderKanban,
    title: "Project & Ticket Management",
    description: "Drag-and-drop Kanban boards, priority labels, deadlines, and subtickets. Every project stays on track with full visibility from day one.",
    accent: "from-blue-500 to-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Realtime Team Chat",
    description: "Per-channel messaging with threaded replies, file sharing, and instant notifications. Keep conversations tied to the work that matters.",
    accent: "from-violet-500 to-violet-600",
  },
  {
    icon: FileText,
    title: "File Sharing & Storage",
    description: "Upload, organise, and share documents directly inside projects. No switching tabs or losing track of which version is current.",
    accent: "from-emerald-500 to-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Real-time dashboards covering task completion rates, team velocity, and project health — exportable as CSV with one click.",
    accent: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Role-Based Access Control",
    description: "Granular permissions for Admins, Managers, and Members. Everyone sees exactly what they need — nothing more, nothing less.",
    accent: "from-rose-500 to-red-600",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description: "Smart alerts for assignments, mentions, deadlines, and status changes. Stay informed without inbox overload.",
    accent: "from-teal-500 to-cyan-600",
  },
];

const ROLES = [
  {
    role: "Admin",
    tagline: "Command the whole operation",
    color: "bg-blue-600",
    ring: "ring-blue-500/30",
    features: [
      "Full user & team management",
      "Organisation-wide analytics",
      "Billing & subscription control",
      "System health monitoring",
      "Custom permissions & settings",
    ],
  },
  {
    role: "Project Manager",
    tagline: "Lead projects from kickoff to launch",
    color: "bg-violet-600",
    ring: "ring-violet-500/30",
    features: [
      "Create & assign projects",
      "Kanban task boards",
      "Team member oversight",
      "Progress reports & exports",
      "Milestone tracking",
    ],
    featured: true,
  },
  {
    role: "Team Member",
    tagline: "Focus on what you do best",
    color: "bg-emerald-600",
    ring: "ring-emerald-500/30",
    features: [
      "Personal task dashboard",
      "Calendar & deadlines",
      "Team chat & file sharing",
      "Project collaboration",
      "Profile & preferences",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Nair",
    title: "VP of Engineering, Lumio Labs",
    avatar: "PN",
    color: "bg-blue-500",
    quote: "Noviq replaced four separate tools for our 60-person team. The role-based access alone saved us hours of permission wrangling every week.",
    stars: 5,
  },
  {
    name: "Jordan Kauffman",
    title: "Head of Product, Orbit Health",
    avatar: "JK",
    color: "bg-violet-500",
    quote: "The realtime chat integrated with tickets is exactly what remote teams need. Our delivery cadence improved by 30% in the first month.",
    stars: 5,
  },
  {
    name: "Sofia Mendes",
    title: "Operations Lead, Fieldstone Agency",
    avatar: "SM",
    color: "bg-emerald-500",
    quote: "Simple enough for the team, powerful enough for the managers. We haven't touched a spreadsheet since the rollout.",
    stars: 5,
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "$49",
    per: "/month",
    desc: "For small teams getting organised",
    features: ["Up to 10 members", "5 active projects", "1 GB file storage", "Basic analytics", "Email support"],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$299",
    per: "/month",
    desc: "For growing teams that move fast",
    features: ["Up to 50 members", "Unlimited projects", "50 GB file storage", "Advanced analytics", "Priority support", "Custom roles"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$2,499",
    per: "/month",
    desc: "For large organisations at scale",
    features: ["Unlimited members", "Unlimited projects", "500 GB file storage", "Real-time reporting", "Dedicated CSM", "SSO & SCIM", "SLA guarantee"],
    cta: "Start free trial",
    highlight: false,
  },
];

const LandingPage = () =>{
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080e1a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              <img src={logo} alt="Logo" />
            </div>
            <span className="text-white font-bold text-lg tracking-wide ">Noviq</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())} className="text-sm text-gray-400 hover:text-white transition-colors font-medium">{l}</button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/sign-in" className="text-sm text-gray-300 hover:text-white font-medium transition-colors px-4 py-2">Sign in</Link>
            <Link to="/sign-up" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Get started free</Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-400 hover:text-white p-1">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#080e1a] border-t border-white/5 px-5 pb-5 pt-3 space-y-3">
            {NAV_LINKS.map((l) => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())} className="block w-full text-left text-gray-300 py-2 text-sm font-medium">{l}</button>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/sign-in" className="text-center py-2.5 text-sm text-gray-300 border border-white/10 rounded-lg">Sign in</Link>
              <Link to="/sign-up" className="text-center py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg">Get started free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#080e1a] overflow-hidden pt-16">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px]" />
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-150 h-150 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-100 h-100 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-300 text-xs font-semibold tracking-wide uppercase">Now with realtime collaboration</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-7">
            Ship faster.<br />
            <span className="bg-linear-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Stay aligned.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The Enterprise management platform built for real teams — with role-based access, realtime chat, file sharing, and analytics all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/sign-up" className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40">
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/sign-in" className="inline-flex items-center gap-2 text-gray-300 hover:text-white font-semibold px-6 py-3.5 rounded-xl border border-white/10 hover:border-white/20 transition-colors text-base">
              Sign in to your account
            </Link>
          </div>

          {/* Quick demo role buttons */}
          <p className="text-xs text-gray-600 mb-3 uppercase tracking-widest font-semibold">Quick demo — no sign-up needed</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "Admin dashboard", path: "", color: "border-blue-500/30 text-blue-400 hover:bg-blue-500/10" },
              { label: "Manager dashboard", path: "", color: "border-violet-500/30 text-violet-400 hover:bg-violet-500/10" },
              { label: "Member dashboard", path: "", color: "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" },
            ].map(({ label, path, color }) => (
              <Link key={label} to={"#"} className={`text-xs font-semibold border px-4 py-2 rounded-full transition-colors ${color}`}>
                {label} →
              </Link>
            ))}
          </div>
        </div>

        {/* Dashboard preview mockup */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 pb-0">
          <div className="bg-[#0d1526] border border-white/10 rounded-t-2xl overflow-hidden shadow-2xl shadow-black/60">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#0a1020] border-b border-white/5">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-amber-500/60" /><div className="w-3 h-3 rounded-full bg-emerald-500/60" /></div>
              <div className="flex-1 mx-4 bg-white/5 rounded-md h-5 flex items-center px-3"><span className="text-gray-500 text-[10px]">app.noviq.io/admin</span></div>
            </div>
            {/* Dashboard preview */}
            <div className="grid grid-cols-4 h-64">
              {/* Sidebar */}
              <div className="col-span-1 border-r border-white/5 p-4 space-y-2">
                <div className="h-4 bg-blue-500/20 rounded w-3/4 mb-4" />
                {["Dashboard","Projects","Teams","Analytics","Settings"].map((i) => (
                  <div key={i} className={`h-7 rounded-lg flex items-center px-2 gap-2 ${i === "Dashboard" ? "bg-blue-600/20" : "hover:bg-white/5"}`}>
                    <div className={`w-3 h-3 rounded ${i === "Dashboard" ? "bg-blue-400" : "bg-white/10"}`} />
                    <div className={`h-2 rounded flex-1 ${i === "Dashboard" ? "bg-blue-400/40" : "bg-white/10"}`} />
                  </div>
                ))}
              </div>
              {/* Main content */}
              <div className="col-span-3 p-5 space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {[["2,543","Users","blue"],["48","Projects","violet"],["1,247","Tasks","emerald"],["99.8%","Uptime","amber"]].map(([v,l,c]) => (
                    <div key={l} className={`bg-${c}-500/10 border border-${c}-500/20 rounded-xl p-3`}>
                      <div className={`text-${c}-400 text-sm font-bold mb-0.5`}>{v}</div>
                      <div className="text-gray-500 text-xs">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/3 border border-white/5 rounded-xl p-3">
                    <div className="h-2 bg-white/10 rounded w-1/2 mb-3" />
                    <div className="flex items-end gap-1 h-16">
                      {[40,65,45,80,60,90,70,95].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-500/30 rounded-t" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/3 border border-white/5 rounded-xl p-3 space-y-2">
                    <div className="h-2 bg-white/10 rounded w-2/3 mb-2" />
                    {["Sarah J. — created project","Mike C. — completed task","Emily D. — joined team"].map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full bg-${["blue","emerald","violet"][i]}-500/40 shrink-0`} />
                        <div className="h-1.5 bg-white/10 rounded flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#0d1526] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-white mb-1">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              One platform.<br />Every workflow.
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Purpose-built features that fit how modern teams actually work — no bolt-ons, no integrations tax.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="group p-7 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 bg-white">
                  <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${f.accent} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section id="roles" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-violet-600 text-sm font-bold uppercase tracking-widest mb-3">Built for every role</p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Right tools,<br />right people.
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Three distinct workspaces, each tailored to what that person actually needs to do their best work.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {ROLES.map((r) => (
              <div key={r.role} className={`relative rounded-2xl border-2 p-8 transition-all ${r.featured ? "border-violet-500 shadow-xl shadow-violet-100 bg-white scale-[1.02]" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                {r.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">Most popular</div>
                )}
                <div className={`w-10 h-10 ${r.color} rounded-xl flex items-center justify-center mb-5`}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.role}</h3>
                <p className="text-gray-400 text-sm mb-6">{r.tagline}</p>
                <ul className="space-y-2.5">
                  {r.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 bg-[#080e1a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-3">What teams say</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Trusted by teams<br />that ship.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 transition-colors">
                <div className="flex mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center shrink-0`}>
                    <span className="text-white text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">Simple pricing</p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Pay for what<br />you actually use.
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">All plans include a 14-day free trial. No credit card required to get started.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PRICING.map((p) => (
              <div key={p.name} className={`rounded-2xl border-2 p-8 ${p.highlight ? "border-blue-600 shadow-xl shadow-blue-100 scale-[1.02] bg-white" : "border-gray-200 bg-white"}`}>
                {p.highlight && <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Best value</div>}
                <h3 className="text-xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.name}</h3>
                <p className="text-gray-400 text-sm mb-5">{p.desc}</p>
                <div className="flex items-end gap-1 mb-7">
                  <span className="text-4xl font-black text-gray-900">{p.price}</span>
                  <span className="text-gray-400 text-sm pb-1">{p.per}</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/sign-up"
                  className={`block text-center py-3 rounded-xl font-bold text-sm transition-colors ${p.highlight ? "bg-blue-600 text-white hover:bg-blue-700" : "border-2 border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50"}`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-linear-to-br from-blue-600 via-blue-700 to-violet-700 py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Your team deserves<br />better tools.
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">Start your 14-day free trial today. Set up takes under 5 minutes and no credit card is required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/sign-up" className="group inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-base hover:bg-blue-50 transition-colors shadow-xl">
              Get started free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/sign-in" className="inline-flex items-center gap-2 text-white font-semibold px-7 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-base">
              Sign in
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: Lock, text: "No credit card required" },
              { icon: Globe, text: "99.9% uptime SLA" },
              { icon: TrendingUp, text: "Setup in 5 minutes" },
              { icon: Clock, text: "Cancel anytime" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-blue-200 text-sm">
                <Icon className="w-4 h-4" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080e1a] border-t border-white/5 py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <img src={logo} alt="Tool logo" />
                </div>
                <span className="text-white font-bold text-lg">Noviq</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">The all-in-one platform for modern teams to collaborate, manage projects, and ship great work.</p>
            </div>
            <div>
              <p className="text-gray-300 font-semibold text-sm mb-4">Product</p>
              <ul className="space-y-2.5">
                {["Features","Pricing","Changelog","Roadmap"].map((l) => (
                  <li key={l}><a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-gray-300 font-semibold text-sm mb-4">Company</p>
              <ul className="space-y-2.5">
                {["About","Blog","Careers","Press"].map((l) => (
                  <li key={l}><a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-gray-300 font-semibold text-sm mb-4">Legal</p>
              <ul className="space-y-2.5">
                {["Privacy Policy","Terms of Service","Cookie Policy","Security"].map((l) => (
                  <li key={l}><a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-center">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Noviq. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;