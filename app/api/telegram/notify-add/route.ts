import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';

const USER_ID = 'user-1';

export async function POST(request: Request) {
  try {
    const { ticker } = await request.json();
    
    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    const db = readDb();
    const user = db.users[USER_ID];

    if (!user || !user.telegramChatId) {
      return NextResponse.json({ error: 'Telegram not connected' }, { status: 400 });
    }

    // Update the trackedSymbols list in database.json
    if (!user.trackedSymbols) {
      user.trackedSymbols = [];
    }
    if (!user.trackedSymbols.includes(ticker)) {
      user.trackedSymbols.push(ticker);
      const { writeDb } = await import('@/lib/db');
      writeDb(db);
    }

    // Send the notification
    const message = `✅ <b>Successfully added $${ticker}</b>\n\nYou are now tracking $${ticker}. You will receive real-time alerts when breaking news impacts this stock.`;
    
    await sendTelegramNotification(user.telegramChatId, message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending add notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
