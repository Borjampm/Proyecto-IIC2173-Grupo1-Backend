const fs = require('fs');
const insertValuesOnDictionary = require('../utils/dictionarys');

const keyValues = ['HOST', 'PORT', 'USER', 'PASSWORD']

function loadCredentials() {
    const secretFile = fs.readFileSync('./credentials.secret', 'utf-8');
    const credentials = parser(secretFile);
    return credentials;
  }

function parser(file) {
  let lines = file.split('\n');
  
  lines = removeCommentsLines(lines);
  lines = removeNonKeyValueLines(lines);
  lines = removeLineSkipForEachLine(lines);

  let dictionary = getEmptyDictionaryWithKeys();
  dictionary = insertValuesOnDictionary(dictionary, lines, '=');

  return dictionary;
}

function removeCommentsLines(lines) {
  const linesWithoutComments = lines.filter(line => !line.includes('#'));
  return linesWithoutComments;
}

function removeNonKeyValueLines(lines) {
  const linesWithOnlyKeyAndValues = lines.filter(line => {
    return keyValues.some(key => line.includes(key));
  });
  return linesWithOnlyKeyAndValues;
}

function removeLineSkipForEachLine(lines) { 
  const linesWithoutLineSkip = lines.map(item => item.replace('\r', ''));
  return linesWithoutLineSkip;
}

function getEmptyDictionaryWithKeys() {
  const dictionary = {};

  for (const key of keyValues) {
    dictionary[key] = '';
  }

  return dictionary;
}

module.exports = loadCredentials;