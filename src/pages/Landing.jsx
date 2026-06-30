import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-72 h-72 sm:w-[600px] sm:h-[600px] bg-cyan-500/20 blur-3xl rounded-full -top-24 -left-24" />
      <div className="absolute w-72 h-72 sm:w-[500px] sm:h-[500px] bg-violet-500/20 blur-3xl rounded-full -bottom-24 -right-24" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Main */}
      <div className="relative max-w-7xl mx-auto min-h-screen flex items-center px-5 sm:px-8 py-12">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT */}
          <div className="text-center lg:text-left">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-sm mb-6">
              ⚡ AI Productivity Companion
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Last Minute{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
                Life Saver
              </span>
            </h1>

            <p className="mt-6 text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Stop wasting time. Let AI prioritize your tasks,
              generate smart schedules, and keep you productive
              in seconds.
            </p>

            <p className="mt-4 text-gray-500 text-sm">
              Built for students, developers, and last-minute warriors ⚡
            </p>

            <div className="mt-8">
              <Link to="/login">
                <button className="w-full sm:w-auto px-10 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-2xl font-semibold text-lg transition duration-200">
                  Get Started
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mt-10 text-sm text-gray-400">

              <div className="bg-slate-900 px-4 py-2 rounded-xl">
                ⚡ Instant Planning
              </div>

              <div className="bg-slate-900 px-4 py-2 rounded-xl">
                🧠 AI Powered
              </div>

              <div className="bg-slate-900 px-4 py-2 rounded-xl">
                📅 Task Scheduling
              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-3 backdrop-blur-xl shadow-2xl">

              <img
                src="/landing.png"
                alt="Preview"
                className="rounded-2xl w-full"
              />

            </div>

            {/* Desktop Floating Cards */}

            <div className="hidden lg:block absolute -top-5 -left-5 bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl shadow-xl">
              <p className="text-cyan-400 font-semibold">
                🔥 Smart Planning
              </p>
              <p className="text-xs text-gray-400">
                AI organizes chaos
              </p>
            </div>

            <div className="hidden lg:block absolute -bottom-5 -right-5 bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl shadow-xl">
              <p className="text-violet-400 font-semibold">
                ⏱ Time Saver
              </p>
              <p className="text-xs text-gray-400">
                Boost productivity
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}