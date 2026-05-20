import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'database.json');

const token = process.env.TELEGRAM_BOT_TOKEN?.replace(/^"|"$/g, '');
const API_URL = `https://api.telegram.org/bot${token}`;

let lastUpdateId = 0;

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) return { users: {}, pendingLinks: {} };
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error('Error reading database:', e);
    return { users: {}, pendingLinks: {} };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing database:', e);
  }
}

async function sendMessage(chatId, text) {
  await fetch(`${API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
  });
}

async function poll() {
  try {
    const res = await fetch(`${API_URL}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    
    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        lastUpdateId = Math.max(lastUpdateId, update.update_id);
        
        if (update.message && update.message.text) {
          console.log(`Received: ${update.message.text}`);
          
          if (update.message.text.startsWith('/link ')) {
            const pin = update.message.text.split(' ')[1];
            const db = readDb();
            const userId = db.pendingLinks[pin];
            
            if (!userId) {
              await sendMessage(update.message.chat.id, '❌ Invalid or expired PIN code.');
              continue;
            }
            
            if (!db.users[userId]) db.users[userId] = { trackedSymbols: [] };
            db.users[userId].telegramChatId = update.message.chat.id;
            delete db.pendingLinks[pin];
            writeDb(db);
            
            await sendMessage(update.message.chat.id, '✅ <b>Successfully linked!</b>\nYour Telegram account is now connected.');
            console.log(`Successfully linked pin ${pin}`);
          }
        }
      }
    }
  } catch (err) {
    console.error('Polling error:', err);
  }
  
  // Schedule next poll
  setTimeout(poll, 1000);
}

console.log('⏳ Starting Raw Telegram Bot polling...');
poll();
