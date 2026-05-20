import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { initBot } from '@/lib/telegram';

const USER_ID = 'user-1'; // Mock logged-in user

export async function POST() {
  initBot(); // Explicitly call to prevent Next.js from tree-shaking the bot initialization
  
  const db = readDb();
  
  // 1. Generate a random 6-digit PIN
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  
  // 2. Save it to DB mapped to our user
  db.pendingLinks[pin] = USER_ID;
  writeDb(db);

  return NextResponse.json({ pin });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get('pin');
  
  const db = readDb();
  const user = db.users[USER_ID];

  // If a specific PIN is being polled, check if it has been consumed
  if (pin) {
    // If the PIN is still in pendingLinks, it hasn't been processed yet
    if (db.pendingLinks[pin]) {
      return NextResponse.json({ connected: false });
    }
    // If it's gone from pendingLinks AND user has chat ID, it was successful
    if (user && user.telegramChatId) {
      return NextResponse.json({ connected: true });
    }
  } else {
    // Legacy behavior or initial check: just check if user has chat ID
    if (user && user.telegramChatId) {
      return NextResponse.json({ connected: true });
    }
  }

  return NextResponse.json({ connected: false });
}
