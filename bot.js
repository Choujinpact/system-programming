const { Telegraf } = require('telegraf')

// Вставь свой токен
const bot = new Telegraf('8298704429:AAG5fAYMg8GKAoBKv7TqVB71mBf3S4J_qpQ')

// Обработчик команды /start
bot.start((ctx) => {
  ctx.reply(' Бот работает! Напиши мне что-нибудь')
})

// Обработчик текстовых сообщений
bot.on('text', (ctx) => {
  ctx.reply(`Ты написал: ${ctx.message.text}`)
})

// Запуск бота
bot.launch().then(() => {
  console.log(' Бот ЗАПУЩЕН!')
  console.log(' Иди в Telegram и напиши /start')
})

// Включи graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
