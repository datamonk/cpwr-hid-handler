const cache = require('./cache-service.js');

const userData = { id: 1, name: 'Alice' };
cache.setCache('user:1', userData);

const cachedUser = cache.getCache('user:1');
console.log(cachedUser); // { id: 1, name: 'Alice' }