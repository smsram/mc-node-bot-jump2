const mineflayer = require('mineflayer');

let bot;
let reconnecting = false;
let moveInterval;

// Time Config (in milliseconds)
const RUN_TIME = 1 * 60 * 60 * 1000; // 1 hour active
const REST_TIME = 1 * 60 * 60 * 1000; // 1 hour rest

console.log(`⏳ Bot will wait ${REST_TIME / (60 * 60 * 1000)} hour before first join...`);
setTimeout(createBot, REST_TIME); // First wait 1 hour

function createBot() {
  if (reconnecting) return; // Prevent duplicate connections
  console.log('🚀 Joining server...');

  bot = mineflayer.createBot({
    host: 'smsram.aternos.me',
    port: 48121,
    username: 'bot_gadu',
    version: '1.21.4',
    auth: 'offline',
    viewDistance: 'tiny',
    disableChatSigning: true,
    physicsEnabled: false
  });

  bot.on('spawn', () => {
    console.log('✅ Bot joined and will move for 1 hour.');
    reconnecting = false;
    startRandomMovement();
    setTimeout(stopBot, RUN_TIME); // Stop bot after 1 hour
  });

  bot.on('kicked', (reason) => {
    console.error(`⚠️ Bot was kicked: ${reason}`);
    handleReconnection();
  });

  bot.on('end', () => {
    console.log('🔄 Bot disconnected.');
    handleReconnection();
  });

  bot.on('error', (err) => {
    console.error('❌ Bot error:', err);
    handleReconnection();
  });
}

// Bot movement function
function startRandomMovement() {
  if (!bot || !bot.entity) return;

  const actions = ['forward', 'back', 'left', 'right'];
  moveInterval = setInterval(() => {
    if (!bot || !bot.entity) return clearInterval(moveInterval);

    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    bot.clearControlStates();
    bot.setControlState(randomAction, true);
    setTimeout(() => bot.setControlState(randomAction, false), 200);
  }, 10000); // Moves every 10 seconds
}

// Stop bot after 1 hour and schedule rejoin
function stopBot() {
  console.log(`🛑 Bot leaving. Waiting ${REST_TIME / (60 * 60 * 1000)} hour before next join...`);
  clearInterval(moveInterval);
  bot.end();
  setTimeout(createBot, REST_TIME); // Rejoin after 1 hour
}

// Handle reconnection attempts
function handleReconnection() {
  if (reconnecting) return;
  reconnecting = true;

  console.log('🔁 Attempting to reconnect in 60 seconds...');
  setTimeout(createBot, 60000); // Try reconnecting every 60 seconds
}
