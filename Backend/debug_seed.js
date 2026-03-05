try {
  require('./seedPremiumEvents.js');
} catch (err) {
  require('fs').writeFileSync('out.txt', err.stack);
}