try {
  require('./seedPremiumEvents.js');
} catch (e) {
  require('fs').writeFileSync('err.txt', e.stack || e.toString());
}