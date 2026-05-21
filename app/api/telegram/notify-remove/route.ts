import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

const USER_ID = 'user-1';

export async function POST(request: Request) {
  try {
    const { ticker } = await request.json();
    
    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    const db = readDb();
    const user = db.users[USER_ID];

    if (user && user.trackedSymbols) {
      user.trackedSymbols = user.trackedSymbols.filter(
        (t) => t.toUpperCase() !== ticker.toUpperCase()
      );
      writeDb(db);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing ticker from Telegram watchlist:', error);
    return NextResponse.json({ error: 'Failed to sync watchlist removal' }, { status: 500 });
  }
}
