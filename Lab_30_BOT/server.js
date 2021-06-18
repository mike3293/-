const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');

dotenv.config({
    path: './.env',
});

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.command('start', ctx => {
    console.log(ctx.from);
    bot.telegram.sendMessage(ctx.chat.id, 'Hi, type any text', {});
});

bot.hears(/(.+)/, async ctx => {
    const text = ctx.match[1];
    await ctx.reply(`echo: ${text}`);
});

bot.launch();
