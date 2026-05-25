import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

// ── Logging ──────────────────────────────────────────────────────────────────

function log(level, msg, meta = {}) {
  const line = { ts: new Date().toISOString(), level, msg, ...meta };
  const out = level === 'error' ? console.error : console.log;
  out(JSON.stringify(line));
}

// ── App ───────────────────────────────────────────────────────────────────────

const app = express();

app.use(cors());
app.use(express.json());

// Log every incoming request and its eventual response
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    log(res.statusCode >= 400 ? 'error' : 'info', 'request', {
      method: req.method,
      path:   req.path,
      status: res.statusCode,
      ms:     Date.now() - start,
    });
  });
  next();
});

// ── Resend ────────────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  log('error', 'RESEND_API_KEY is not set — emails will fail');
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ALLOWED_TIMES = ['17:00', '18:00', '19:00', '20:00'];
const ALLOWED_FOODS = ['pizza', 'sushi', 'burgers', 'pasta', 'tacos', 'ramen'];

const FOOD_EMOJI = {
  pizza: '🍕', sushi: '🍣', burgers: '🍔', pasta: '🍝', tacos: '🌮', ramen: '🍜',
};

const TIME_LABELS = {
  '17:00': '5:00 PM', '18:00': '6:00 PM', '19:00': '7:00 PM', '20:00': '8:00 PM',
};

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.post('/api/respond', async (req, res) => {
  const { inviterEmail, selectedDate, selectedTime, foodType } = req.body;

  if (!inviterEmail || !selectedDate || !selectedTime || !foodType) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!ALLOWED_TIMES.includes(selectedTime)) {
    return res.status(400).json({ error: 'Invalid time selection' });
  }
  if (!ALLOWED_FOODS.includes(foodType)) {
    return res.status(400).json({ error: 'Invalid food type' });
  }

  const emoji     = FOOD_EMOJI[foodType] ?? '';
  const timeLabel = TIME_LABELS[selectedTime];
  const dateLabel = formatDate(selectedDate);
  const foodLabel = foodType.charAt(0).toUpperCase() + foodType.slice(1);

  log('info', 'sending email', { to: inviterEmail, date: selectedDate, time: selectedTime, food: foodType });

  const { data, error } = await resend.emails.send({
    from:    process.env.EMAIL_FROM || 'Go on a Date <onboarding@resend.dev>',
    to:      inviterEmail,
    subject: 'Someone said YES to your date! 🥂',
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; background: #FDF6EC; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; font-size: 56px; margin-bottom: 16px;">🥰</div>
        <h1 style="font-family: Georgia, serif; color: #be123c; text-align: center; margin: 0 0 8px;">It's a date!</h1>
        <p style="color: #f43f5e; text-align: center; margin: 0 0 32px; font-size: 16px;">
          Your invitation was accepted. Here's what they chose:
        </p>
        <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px; color: #9f1239; font-size: 16px;">📅 <strong>${dateLabel}</strong></p>
          <p style="margin: 0 0 12px; color: #9f1239; font-size: 16px;">⏰ <strong>${timeLabel}</strong></p>
          <p style="margin: 0; color: #9f1239; font-size: 16px;">${emoji} <strong>${foodLabel}</strong></p>
        </div>
        <p style="color: #fb7185; text-align: center; font-style: italic; margin: 0;">
          Get ready for a wonderful time! 💕
        </p>
      </div>
    `,
  });

  if (error) {
    log('error', 'resend error', {
      name:       error.name,
      message:    error.message,
      statusCode: error.statusCode,
    });
    return res.status(502).json({ error: 'Failed to send email', detail: error.message });
  }

  log('info', 'email sent', { id: data.id, to: inviterEmail });
  res.status(200).json({ ok: true });
});

// ── Error handler ─────────────────────────────────────────────────────────────

app.use((err, req, res, _next) => {
  log('error', 'unhandled error', { message: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────

const port = process.env.PORT || 3001;
app.listen(port, () => log('info', `server started`, { port }));
