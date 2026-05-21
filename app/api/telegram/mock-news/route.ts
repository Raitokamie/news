import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { headline, messageBody, tickers = [], sentiment = 'good', impact = 'medium' } = body;

    if (!headline || !messageBody) {
      return NextResponse.json(
        { error: 'Missing required fields: headline and messageBody are required.' },
        { status: 400 }
      );
    }

    const db = readDb();
    const users = db.users || {};
    const notifiedUsers: { userId: string; chatId: string | number }[] = [];

    // Find users who track any of the tickers in the mock news
    for (const [userId, user] of Object.entries(users) as [string, any][]) {
      if (!user.telegramChatId) continue;

      // Check if user is tracking at least one of the tickers in the news
      const isTracking = tickers.some((ticker: string) =>
        user.trackedSymbols?.includes(ticker.toUpperCase())
      );

      const isHighImpact = impact === 'high';

      if (isTracking || isHighImpact || tickers.length === 0) {
        // If tickers array is empty, broadcast to all linked users
        const sentimentEmoji = sentiment === 'good' ? '🟢' : sentiment === 'bad' ? '🔴' : '🟡';
        const impactEmoji = impact === 'high' ? '🚀' : impact === 'medium' ? '⚡' : '📝';

        const telegramMessage = `
📰 <b>Breaking News</b>
==============================
<b>Headline:</b> ${headline}
<b>Sentiment:</b> ${sentimentEmoji} ${sentiment.toUpperCase()}
<b>Impact:</b> ${impactEmoji} ${impact.toUpperCase()}
<b>Related Tickers:</b> ${tickers.map((t: string) => `$${t.toUpperCase()}`).join(', ') || 'None'}

<b>Details:</b>
${messageBody}

<i>This is an automated alert from your NewsMaster Watchlist.</i>
        `.trim();

        const result = await sendTelegramNotification(user.telegramChatId, telegramMessage);
        if (result.success) {
          notifiedUsers.push({ userId, chatId: user.telegramChatId });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Mock news alert processed.',
      notifiedCount: notifiedUsers.length,
      notifiedUsers
    });
  } catch (error: any) {
    console.error('Error in mock-news route:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
