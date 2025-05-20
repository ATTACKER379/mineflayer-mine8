const express = require('express');
const mineflayer = require('mineflayer');

const app = express();
let bot;

const config = {
  host: 'hypixel.uz',
  port: 25566,
  version: '1.12',
  username: 'AT_nether_bot8',
  password: 'abdu2006',
  loginPassword: '89789789',
};

function startBot() {
  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    version: config.version,
    username: config.username,
  });

  bot.on('messagestr', (message) => {
    console.log(message);

    if (message.includes('/register')) {
      bot.chat(`/register ${config.password} ${config.password}`);
    }

    if (message.includes('/login')) {
      bot.chat(`/login ${config.loginPassword}`);
    }
  });

  bot.on('spawn', () => {
    console.log('✅ Bot spawn bo‘ldi!');

    // 5s kutib warp qiladi
    setTimeout(() => {
      bot.chat('/is warp mine2');
      console.log('📦 /is warp farm komandasi yuborildi');

      // 5s kutib qazishni boshlaydi
      setTimeout(() => {
        dig();
      }, 5000);
    }, 5000);
  });

  // Kavlash funksiyasi
  async function dig() {
    try {
      if (!bot.heldItem || !bot.heldItem.name.includes("pickaxe")) {
        const pickaxe = bot.inventory.items().find(i => i.name.includes("pickaxe"));
        if (pickaxe) await bot.equip(pickaxe, "hand");
        else return bot.quit();
      }

      const block = bot.blockAtCursor(6);
      if (!block) return setTimeout(dig, 200);

      await bot.dig(block);
      dig(); // rekursiv davom ettiradi
    } catch (err) {
      console.log("⛏️ Kavlashda xatolik:", err.message);
      setTimeout(dig, 500);
    }
  }

  // o‘lganda /back yozadi
  bot.on('death', () => {
    console.log('☠️ Bot o‘ldi. /back yozilmoqda...');
    setTimeout(() => {
      bot.chat('/back');
    }, 3000);
  });

  // serverdan chiqsa qayta ulanadi
  bot.on('end', () => {
    console.log('⚠️ Bot serverdan chiqdi. Qayta ulanmoqda...');
    setTimeout(startBot, 5000);
  });

  bot.on('error', err => {
    console.log('❌ Bot xatolik berdi:', err.message);
  });
}

// Botni ishga tushuramiz
startBot();

// UptimeRobot uchun mini web-server
app.get('/', (req, res) => {
  res.send('✅ Bot ishlayapti!');
});
app.listen(3000, () => {
  console.log('🌐 Web server ishga tushdi (port 3000)');
});
