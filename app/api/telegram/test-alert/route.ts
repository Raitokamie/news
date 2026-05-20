import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST() {
  const db = readDb();
  const user = db.users['user-1'];

  if (!user || !user.telegramChatId) {
    return NextResponse.json({ success: false, error: 'User is not linked to Telegram yet.' });
  }

  const message = `
🚨 <b>HOT NEWS: AAPL</b>
==============================
<b>Headline:</b> Apple unveils revolutionary AI-driven Siri 2.0 at WWDC.
<b>Impact:</b> VERY HIGH 🚀
<b>Details:</b> Analysts predict a massive super-cycle for the upcoming iPhone 18. Stock surges 4% in pre-market trading.

<i>This is an automated alert from your NewsMaster Watchlist.</i>
  `;

  const result = await sendTelegramNotification(user.telegramChatId, message);

  return NextResponse.json(result);
}
