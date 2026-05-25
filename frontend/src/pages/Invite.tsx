import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { inviteApi, decodeInvite, type InviteData } from '../api';
import StepTransition from '../components/StepTransition';
import MovingButton from '../components/MovingButton';
import FoodCard from '../components/FoodCard';

const TIMES = [
  { value: '17:00', label: '5:00 PM — we eating with retirees' },
  { value: '18:00', label: '6:00 PM — this is the right answer tbh' },
  { value: '19:00', label: '7:00 PM — you are making me hungry already' },
  { value: '20:00', label: '8:00 PM — we eating dinner or breakfast?' },
];

const FOODS = [
  { emoji: '🍕', label: 'pizza', value: 'pizza' },
  { emoji: '🍣', label: 'sushi', value: 'sushi' },
  { emoji: '🍔', label: 'burgers', value: 'burgers' },
  { emoji: '🍝', label: 'pasta', value: 'pasta' },
  { emoji: '🌮', label: 'tacos', value: 'tacos' },
  { emoji: '🍜', label: 'ramen', value: 'ramen' },
];

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

function formatTime(t: string) {
  const h = Number(t.split(':')[0]);
  return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function Invite() {
  const { token } = useParams<{ token: string }>();
  const invite: InviteData | null = token ? decodeInvite(token) : null;

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedFood, setSelectedFood] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="animate-fade-slide">
          <div className="text-6xl mb-4">💔</div>
          <h1 className="font-display text-3xl text-rose-700 mb-2">Invalid invitation</h1>
          <p className="text-rose-400">This link doesn't look right.</p>
        </div>
      </div>
    );
  }

  async function handleConfirm() {
    if (!invite) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await inviteApi.respond({
        inviterEmail: invite.email,
        selectedDate,
        selectedTime,
        foodType: selectedFood,
      });
      setStep(3);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      {step === 0 && (
        <StepTransition step={step}>
          <div className="text-center max-w-md">
            <div className="text-7xl mb-6 animate-float">💝</div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-rose-700 mb-4 leading-tight">
              Would you like to go on a date with me?
            </h1>
            <p className="text-rose-400 mb-12">Choose carefully... or don't.</p>
            <div className="flex gap-6 justify-center items-center">
              <button
                onClick={() => setStep(1)}
                className="px-10 py-4 rounded-full bg-rose-400 text-white font-semibold text-xl shadow-lg hover:bg-rose-500 transition-colors"
              >
                Yes! 💕
              </button>
              <MovingButton />
            </div>
          </div>
        </StepTransition>
      )}

      {step === 1 && (
        <StepTransition step={step}>
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">📅</div>
              <h2 className="font-display text-3xl font-semibold text-rose-700">Pick a date & time</h2>
              <p className="text-rose-400 mt-1 text-sm">
                Any day between {formatDate(invite.start)} and {formatDate(invite.end)}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg space-y-5">
              <div>
                <label className="block text-sm font-medium text-rose-600 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={invite.start}
                  max={invite.end}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-rose-600 mb-1">Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none bg-white transition-colors"
                >
                  <option value="" disabled>Select a time…</option>
                  {TIMES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-rose-400 text-white font-semibold text-lg shadow hover:bg-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </StepTransition>
      )}

      {step === 2 && (
        <StepTransition step={step}>
          <div className="w-full max-w-lg">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🍽️</div>
              <h2 className="font-display text-3xl font-semibold text-rose-700">What are we eating?</h2>
              <p className="text-rose-400 mt-1 text-sm">Pick one — choose wisely!</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {FOODS.map((food) => (
                <FoodCard
                  key={food.value}
                  emoji={food.emoji}
                  label={food.label}
                  selected={selectedFood === food.value}
                  onSelect={() => setSelectedFood(food.value)}
                />
              ))}
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 text-center">
                {submitError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl border-2 border-rose-200 text-rose-400 font-semibold hover:bg-rose-50 transition-colors"
              >
                ← Back
              </button>
              <button
                disabled={!selectedFood || submitting}
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl bg-rose-400 text-white font-semibold shadow hover:bg-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Confirming…' : "It's a date! 🥂"}
              </button>
            </div>
          </div>
        </StepTransition>
      )}

      {step === 3 && (
        <StepTransition step={step}>
          <div className="text-center max-w-sm">
            <div className="text-7xl mb-6 animate-float">🥰</div>
            <h1 className="font-display text-4xl font-semibold text-rose-700 mb-4">
              It's a date!
            </h1>
            <p className="text-rose-500 text-lg leading-relaxed mb-8">
              See you on <strong>{formatDate(selectedDate)}</strong> at{' '}
              <strong>{formatTime(selectedTime)}</strong> for some delicious{' '}
              <strong>{selectedFood}</strong>. Can't wait! 💕
            </p>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow">
              <div className="text-4xl mb-2">
                {FOODS.find((f) => f.value === selectedFood)?.emoji}
              </div>
              <p className="text-rose-400 text-sm">
                {formatDate(selectedDate)} &nbsp;•&nbsp; {formatTime(selectedTime)}
              </p>
            </div>
          </div>
        </StepTransition>
      )}
    </div>
  );
}
