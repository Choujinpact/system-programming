const { Telegraf } = require('telegraf')
const axios = require('axios')

// Вставь свой токен
const bot = new Telegraf('8335924452:AAHyWKsTLjQXuwIB5n5tkb-ggxefBpsh1c4')

// Улучшенная функция поиска в Wikipedia
async function searchWikipedia(query) {
  try {
    console.log('🔍 Ищем:', query)

    // Пробуем русскую Wikipedia
    const url = `https://ru.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      query
    )}`
    console.log('URL:', url)

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'TelegramBot/1.0',
      },
    })

    console.log('✅ Найдено:', response.data.title)
    return response.data
  } catch (error) {
    console.log('❌ Ошибка русской версии:', error.message)

    // Пробуем английскую Wikipedia
    try {
      const enUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        query
      )}`
      console.log('Пробуем английскую версию...')

      const enResponse = await axios.get(enUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'TelegramBot/1.0',
        },
      })

      console.log('✅ Найдено в английской:', enResponse.data.title)
      return enResponse.data
    } catch (enError) {
      console.log('❌ Ошибка английской версии:', enError.message)
      return null
    }
  }
}

// Команда /start
bot.start((ctx) => {
  ctx.reply(
    `📚 Привет! Я Wikipedia-бот\n\nПросто напиши любое слово, и я найду информацию!\n\nПример: "JavaScript", "Москва", "Наполеон"`
  )
})

// Обработчик текстовых сообщений
bot.on('text', async (ctx) => {
  const query = ctx.message.text.trim()

  // Игнорируем команды
  if (query.startsWith('/')) return

  try {
    const waitingMessage = await ctx.reply('🔍 Ищу в Wikipedia...')

    const result = await searchWikipedia(query)

    // Удаляем сообщение "Ищу..."
    await ctx.telegram.deleteMessage(ctx.chat.id, waitingMessage.message_id)

    if (result && result.extract) {
      // Форматируем ответ
      let response = `📖 **${result.title}**\n\n`
      response += result.extract

      // Обрезаем слишком длинные тексты
      if (response.length > 4000) {
        response = response.substring(0, 4000) + '...'
      }

      // Пробуем отправить с изображением
      if (result.thumbnail && result.thumbnail.source) {
        try {
          await ctx.replyWithPhoto(result.thumbnail.source, {
            caption: response,
            parse_mode: 'Markdown',
          })
        } catch (photoError) {
          // Если не удалось с фото, отправляем просто текст
          await ctx.reply(response, { parse_mode: 'Markdown' })
        }
      } else {
        await ctx.reply(response, { parse_mode: 'Markdown' })
      }

      // Ссылка на статью
      if (result.content_urls) {
        const pageUrl =
          result.content_urls.desktop?.page || result.content_urls.mobile?.page
        if (pageUrl) {
          await ctx.reply(`🔗 ${pageUrl}`)
        }
      }
    } else {
      await ctx.reply(
        `❌ Не удалось найти информацию о "${query}"\n\nПопробуй:\n• "Кошки"\n• "Python"\n• "Эйнштейн"\n• "Луна"`
      )
    }
  } catch (error) {
    console.error('Общая ошибка:', error)
    await ctx.reply('⚠️ Произошла ошибка. Попробуй другой запрос.')
  }
})

// Команда для теста
bot.command('test', async (ctx) => {
  const testQueries = ['Кошки', 'Python', 'Москва', 'JavaScript']

  for (const query of testQueries) {
    try {
      ctx.reply(`🔍 Тестируем: ${query}`)
      const result = await searchWikipedia(query)

      if (result) {
        await ctx.reply(`✅ "${query}" - найдено: ${result.title}`)
      } else {
        await ctx.reply(`❌ "${query}" - не найдено`)
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      await ctx.reply(`⚠️ Ошибка с "${query}": ${error.message}`)
    }
  }
})

// Запуск бота
bot
  .launch()
  .then(() => {
    console.log('📚 Wikipedia-бот ЗАПУЩЕН!')
    console.log('🔍 Тестируй запросы: "Кошки", "Python", "Москва"')
  })
  .catch((error) => {
    console.error('Ошибка запуска:', error)
  })

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
