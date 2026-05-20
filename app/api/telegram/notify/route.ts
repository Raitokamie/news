import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

// This endpoint allows your Next.js application or external services to send notifications
// Example usage: POST /api/telegram/notify with body { "chatId": "12345678", "message": "🚨 <b>Breaking News:</b> AAPL up 5%!" }
export async function POST(req: NextRequest) {
  try {
    // 1. Basic security check (Optional but recommended: Check for an API key in headers)
    const apiKey = req.headers.get('x-api-key');
    const expectedApiKey = process.env.INTERNAL_API_KEY; // Define this in your .env
    
    if (expectedApiKey && apiKey !== expectedApiKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { chatId, message } = body;

    if (!chatId || !message) {
      return NextResponse.json({ error: 'Missing chatId or message in request body' }, { status: 400 });
    }

    // 2. Send the notification
    const result = await sendTelegramNotification(chatId, message);

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Notification sent' });
    } else {
      return NextResponse.json({ error: 'Failed to send notification', details: result.error }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in notify route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
