import { Telegraf } from 'telegraf';
import { mockNews, mockMarketTrends } from '@/lib/mock-data';

export function setupBotCommands(bot: Telegraf) {
  bot.command('start', (ctx) => {
    ctx.reply(`Welcome to NewsMaster Bot! 📈\nYour Chat ID is: <code>${ctx.chat.id}</code>\n\nPlease save this Chat ID and use it in your application settings to receive real-time stock and news notifications.`, { 
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📰 Latest News', callback_data: 'get_news' }],
          [{ text: '📊 Market Trends', callback_data: 'get_market' }]
        ]
      }
    });
  });

  bot.command('help', (ctx) => {
    ctx.reply('Commands available:\n/start - Get your Chat ID and Menu\n/news - Get latest news\n/market - Get market trends\n/ping - Check if the bot is alive.');
  });

  bot.command('ping', (ctx) => {
    ctx.reply('Pong! 🏓 I am alive and listening.');
  });

  bot.command('link', async (ctx) => {
    const message = ctx.message.text;
    const parts = message.split(' ');
    
    if (parts.length < 2) {
      return ctx.reply('❌ Please provide a PIN code. Example: /link 123456');
    }

    const pin = parts[1];
    const { readDb, writeDb } = await import('@/lib/db');
    const db = readDb();

    const userId = db.pendingLinks[pin];

    if (!userId) {
      return ctx.reply('❌ Invalid or expired PIN code. Please generate a new one on the website.');
    }

    // Link the user
    if (!db.users[userId]) {
      db.users[userId] = { trackedSymbols: [] };
    }
    db.users[userId].telegramChatId = ctx.chat.id;
    
    // Remove the used PIN
    delete db.pendingLinks[pin];
    writeDb(db);

    ctx.reply('✅ <b>Successfully linked!</b>\nYour Telegram account is now connected to your NewsMaster dashboard. You will start receiving alerts here.', { parse_mode: 'HTML' });
  });

  bot.command('news', (ctx) => {
    sendNews(ctx);
  });

  bot.command('market', (ctx) => {
    sendMarket(ctx);
  });

  bot.action('get_news', (ctx) => {
    ctx.answerCbQuery('Fetching news...').catch(() => {});
    sendNews(ctx);
  });

  bot.action('get_market', (ctx) => {
    ctx.answerCbQuery('Fetching market trends...').catch(() => {});
    sendMarket(ctx);
  });

  bot.action('show_menu', (ctx) => {
    ctx.answerCbQuery().catch(() => {});
    ctx.reply('<b>Main Menu</b>\nSelect an option below:', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📰 Latest News', callback_data: 'get_news' }],
          [{ text: '📊 Market Trends', callback_data: 'get_market' }]
        ]
      }
    });
  });
}

function sendNews(ctx: any) {
  const topNews = mockNews.slice(0, 3);
  let message = '<b>📰 Latest Top News</b>\n\n';
  
  topNews.forEach((news, index) => {
    message += `<b>${index + 1}. ${news.headline}</b>\n`;
    message += `${news.body.substring(0, 100)}...\n`;
    if (news.tickers && news.tickers.length > 0) {
      const tickers = news.tickers.map(t => `$${t.symbol} (${t.sentiment === 'up' ? '📈' : '📉'})`).join(', ');
      message += `<i>Related: ${tickers}</i>\n`;
    }
    message += `\n`;
  });

  ctx.reply(message, { 
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[{ text: '🔙 Back to Menu', callback_data: 'show_menu' }]]
    }
  });
}

function sendMarket(ctx: any) {
  const topTrends = mockMarketTrends.slice(0, 5);
  let message = '<b>📊 Top Market Trends</b>\n\n';
  
  topTrends.forEach((trend) => {
    const icon = trend.sentiment === 'up' ? '🟢' : '🔴';
    message += `${icon} <b>$${trend.symbol}</b> - ${trend.name}\n`;
    message += `Impact: ${trend.impactLevel} | Score: ${trend.score}\n\n`;
  });

  ctx.reply(message, { 
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[{ text: '🔙 Back to Menu', callback_data: 'show_menu' }]]
    }
  });
}
