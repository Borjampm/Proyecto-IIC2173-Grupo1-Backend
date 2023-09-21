const { RESPONSE_DATETIME } = require('../parameters/response_values');

function insertValuesOnDictionary(dictionary, lines, symbol) {
    for (const line of lines) {
      splited = line.split(symbol);
      const key = splited[0];
      const value = defineValues(splited, key);
      dictionary[key] = value;
    }
    return dictionary;
  }

function defineValues(splited, key) {
    let values;
    if (key === RESPONSE_DATETIME) {
        values = splited[1] + ':' + splited[2] + ':' + splited[3];
    } else {
        values = splited[1];
    }
    return values;
}

module.exports = insertValuesOnDictionary;