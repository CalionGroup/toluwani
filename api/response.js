import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = '';
  for await (const chunk of req) body += chunk;

  let data = {};
  try {
    data = body ? JSON.parse(body) : {};
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const choice = data.choice === 'yes' || data.choice === 'no' ? data.choice : 'unknown';
  const entry = {
    choice,
    at: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || '',
  };

  await redis.set('valentine:last', entry);
  await redis.lpush('valentine:responses', entry);

  return res.status(200).json({ ok: true });
}
