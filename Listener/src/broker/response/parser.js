const { RESPONSE_STOCKS, RESPONSE_ID, RESPONSE_ALL_KEYS } = require('../../parameters/response_values');
let { RESPONSE_DICT, COMPANY_DICT } = require('../../parameters/response_values');
const insertValuesOnDictionary = require('../../utils/dictionarys');

function parser(stringData) {
  let data = stringData.split('}');

  data = removeNonKeyValueLines(data);
  data = parseIdAndDatetime(data);
  data = parseEachCompanyInfo(data);

  return RESPONSE_DICT
}

function parseIdAndDatetime(data) {
    const idAndDateIndex = data.findIndex(line => line.includes(RESPONSE_ID));
    let lines = splitInComma(data[idAndDateIndex]);
    data.splice(idAndDateIndex, 1);

    lines = removeNonKeyValueLines(lines);
    lines = removeStringSintax(lines);
    RESPONSE_DICT = insertValuesOnDictionary(RESPONSE_DICT, lines, ':')

    return data;
}

function parseEachCompanyInfo(data) {
    data[0] = data[0].replace(`"${RESPONSE_STOCKS}":"[`, '');
    data = removeSintaxsSymbols(data);
    data = splitAllCompaniesInComma(data);
    data = removeEmptyLinesInEachCompany(data);
    allCompanies = getAllDictionarysOfEachCompany(data);

    RESPONSE_DICT[RESPONSE_STOCKS] = allCompanies;

    return data;
}
 
function splitInComma(line) {
    return line.split(',');
}

function removeNonKeyValueLines(lines) {
    return lines.filter(line => {
        return RESPONSE_ALL_KEYS.some(key => line.includes(key));
      });
}

function removeSintaxsSymbols(lines) {
    lines = removeDictionarySintax(lines);
    lines = removeStringSintax(lines);
    return removeSlach(lines);
}

function removeStringSintax(lines) {
    const symbols = ['"', '"']
    return removeSintaxInLine(lines, symbols)
}

function removeDictionarySintax(lines) {
    const symbols = ['{', '}']
    return removeSintaxInLine(lines, symbols);
}

function removeSlach(lines) {
    const symbols = ['\\', '\\']
    return removeSintaxInLine(lines, symbols);
}

function removeSintaxInLine(lines, symbols) {
    while (lineContainsTheSintax(lines, symbols)) {
        lines = lines.map(line => line.replace(symbols[0], ''));
        lines = lines.map(line => line.replace(symbols[1], ''));
    }
    return lines;
}

function lineContainsTheSintax(lines, symbols) {
    return lines.some(line => line.includes(symbols[0])) || lines.some(line => line.includes(symbols[1]));
}

function splitAllCompaniesInComma(lines) {
    return lines.map(line => {
        return line.split(',');
    });
}

function removeEmptyLinesInEachCompany(lines) {
    return lines.map(subLine => {
        return subLine.filter(line => line !== '')
    });
}

function getAllDictionarysOfEachCompany(lines) {
    let allCompanies = [];

    for (let line of lines) {
        let company = { ...COMPANY_DICT };
        line = fixIncInShortName(line);
        companyReady = insertValuesOnDictionary(company, line, ':');
        allCompanies.push(companyReady);
    }

    return allCompanies;
}

function fixIncInShortName(line) {
    const incString = ' Inc.';
    if (line.includes(incString)) {
        line[1] = line[1] + ',' + incString;
        line = line.filter(item => item !== incString);
    }
    return line;
}

module.exports = parser;