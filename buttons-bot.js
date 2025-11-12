const { Telegraf, Markup } = require('telegraf')

const bot = new Telegraf('8518326039:AAEHiIaQtUM5afGCEAIRZPD-0Kq5kkIycAY')

// Команда /start - показывает кнопки
bot.start((ctx) => {
  ctx.reply(
    '🤖 Добро пожаловать! Выберите действие:',
    Markup.inlineKeyboard([
      [Markup.button.callback('📅 Дата и время', 'date_btn')],
      [Markup.button.callback('🎲 Случайное число', 'random_btn')],
    ])
  )
})

// Обработка нажатия кнопки "Дата и время"
bot.action('date_btn', (ctx) => {
  const now = new Date()
  const dateStr = now.toLocaleDateString('ru-RU')
  const timeStr = now.toLocaleTimeString('ru-RU')

  ctx.reply(`📅 Сегодня: ${dateStr}\n⏰ Время: ${timeStr}`)

  // Обновляем сообщение с кнопками (убираем "часики" на кнопке)
  ctx.answerCbQuery()
})

// Обработка нажатия кнопки "Случайное число"
bot.action('random_btn', (ctx) => {
  const randomNum = Math.floor(Math.random() * 100) + 1

  ctx.reply(`🎲 Ваше случайное число: ${randomNum}`)
  ctx.answerCbQuery()
})

// Команда /menu - показывает меню с кнопками
bot.command('menu', (ctx) => {
  ctx.reply(
    '📋 Главное меню:',
    Markup.inlineKeyboard([
      [Markup.button.callback('ℹ️ Информация', 'info_btn')],
      [Markup.button.callback('🔧 Настройки', 'settings_btn')],
      [Markup.button.callback('📞 Связаться', 'contact_btn')],
    ])
  )
})

// Обработчики для меню
bot.action('info_btn', (ctx) => {
  ctx.reply(
    'ℹ️ Это демонстрационный бот с кнопками!\n\nИспользуйте /start для начала'
  )
  ctx.answerCbQuery()
})

bot.action('settings_btn', (ctx) => {
  ctx.reply('⚙️ Настройки:\n\nЗдесь будут настройки бота...')
  ctx.answerCbQuery()
})

bot.action('contact_btn', (ctx) => {
  ctx.reply(
    '📞 Связь с разработчиком:\n\nEmail: example@mail.com\nTelegram: @@Choujinpact'
  )
  ctx.answerCbQuery()
})

// Команда /help
bot.help((ctx) => {
  ctx.reply(
    'ℹ️ Доступные команды:\n/start - начать работу\n/menu - показать меню\n/help - справка'
  )
})

// Запуск бота
bot.launch().then(() => {
  console.log('🔄 Бот с кнопками запущен!')
  console.log('🎯 Используй /start для теста кнопок')
})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
