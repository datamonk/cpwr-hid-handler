
const optsCache = {};

function setCache(key, value) {
  optsCache[key] = value;
}

function getCache(key) {
  return optsCache[key];
}

module.exports = {
  setCache,
  getCache,
};
