function insertValuesOnDictionary(dictionary, lines, symbol) {
    for (const line of lines) {
      const [key, value] = line.split(symbol);
      dictionary[key] = value;
    }
    return dictionary;
  }

module.exports = insertValuesOnDictionary;