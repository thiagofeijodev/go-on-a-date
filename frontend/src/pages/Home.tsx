import { useState } from 'react';
import { encodeInvite } from '../api';

export default function Home() {
  const [email, setEmail] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError('');
    if (end < start) {
      setError('End date must be on or after start date.');
      return;
    }
    const token = encodeInvite({ email, start, end });
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    setShareUrl(`${window.location.origin}${base}/#/invite/${token}`);
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (shareUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-fade-slide w-full max-w-sm text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="font-display text-3xl font-semibold text-rose-700 mb-2">
            Your invitation is ready!
          </h1>
          <p className="text-rose-400 mb-8 text-sm">
            Share this link. When they accept, you'll get an email with all the details.
          </p>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
            <p className="text-rose-500 text-xs break-all mb-4 font-mono bg-rose-50 rounded-lg px-3 py-3">
              {shareUrl}
            </p>
            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-xl bg-rose-400 text-white font-semibold shadow hover:bg-rose-500 transition-colors"
            >
              {copied ? 'Copied! 💕' : 'Copy Link'}
            </button>
          </div>

          <button
            onClick={() => { setShareUrl(''); setEmail(''); setStart(''); setEnd(''); }}
            className="text-rose-400 text-sm underline hover:text-rose-600"
          >
            Create another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="animate-fade-slide w-full max-w-md">
        <div className="text-center mb-10">
          <div className="text-7xl mb-4 animate-float">💌</div>
          <h1 className="font-display text-5xl font-semibold text-rose-700 mb-3 leading-tight">
            Go on a date?
          </h1>
          <p className="text-rose-400 text-base leading-relaxed">
            Create a romantic invitation. Enter your email and available dates — we'll give you a link to share.
            When they say yes, you'll get an email with everything they chose.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-rose-600 mb-1">Your email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none bg-white transition-colors"
            />
            <p className="text-rose-300 text-xs mt-1">We'll email you when they accept.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-rose-600 mb-1">From</label>
              <input
                type="date"
                value={start}
                min={today}
                onChange={(e) => setStart(e.target.value)}
                required
                className="w-full px-3 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none bg-white transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-600 mb-1">To</label>
              <input
                type="date"
                value={end}
                min={start || today}
                onChange={(e) => setEnd(e.target.value)}
                required
                className="w-full px-3 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none bg-white transition-colors text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-rose-400 text-white font-semibold text-lg shadow hover:bg-rose-500 transition-colors"
          >
            Create My Invitation 💕
          </button>
        </form>
      </div>
    </div>
  );
}
