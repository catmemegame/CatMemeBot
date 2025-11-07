const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("❌ Bot token not found in environment variables!");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const users = {};

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  if (!users[chatId]) users[chatId] = { coins: 0 };
  bot.sendMessage(chatId, "😺 به CatMeme خوش اومدی!\nروی دکمه زیر بزن تا یه میم بامزه ببینی:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "😂 نشونم بده!", callback_data: "meme" }],
        [{ text: "🎁 جایزه روزانه", callback_data: "daily" }]
      ]
    }
  });
});

// دکمه‌ها
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  if (!users[chatId]) users[chatId] = { coins: 0 };
  const data = query.data;

  if (data === "meme") {
    const memes = [
      "https://i.imgur.com/jk8LqOo.jpeg",
      "https://i.imgur.com/7M4ZzOQ.jpeg",
      "https://i.imgur.com/wf5N1Yb.jpeg"
    ];
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    bot.sendPhoto(chatId, randomMeme, { caption: "😹 مِیوو!" });
  }

  if (data === "daily") {
    users[chatId].coins += 10;
    bot.sendMessage(chatId, `🎉 تبریک! ۱۰ سکه گرفتی.\n💰 موجودی: ${users[chatId].coins}`);
  }

  bot.answerCallbackQuery(query.id);
});

// سرور کوچک برای نگه داشتن ربات فعال
const app = express();
app.get("/", (req, res) => res.send("CatMeme bot is running"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot online on port ${PORT}`));
