function insertValuesOnDictionary(dictionary, lines, symbol) {
    for (const line of lines) {
      splited = line.split(symbol);
      const key = splited[0];
      const value = splited[1];
      dictionary[key] = value;
    }
    return dictionary;
  }

  module.exports = insertValuesOnDictionary;