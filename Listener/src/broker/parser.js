let { 
    RESPONSE_DICT, COMPANY_DICT, RESPONSE_ALL_KEYS, 
    RESPONSE_DATETIME, RESPONSE_STOCKS, RESPONSE_ID
} = require('../parameters/response_values');
const insertValuesOnDictionary = require('../utils/dictionarys');

const SYMBOLS = ['"', '{', '}', '\\'];
const INC_TEXT = ' Inc.';

function parser(dataAsString) {
    let data = dataAsString.split('}');

    data = data.filter(line => RESPONSE_ALL_KEYS.some(key => line.includes(key)));

    const stocksIndex = data.findIndex(line => line.includes(RESPONSE_ID));

    let lines = data[stocksIndex].split(',');
    data.splice(stocksIndex, 1);
    lines = lines.filter(line => RESPONSE_ALL_KEYS.some(key => line.includes(key)));

    RESPONSE_DICT = insertValuesOnDictionary(RESPONSE_DICT, removeAllSymbols(lines), ':');

    data[0] = data[0].replace(`"${RESPONSE_STOCKS}":"[`, '');
    data = removeAllSymbols(data);
    data = data.map(line => line.split(',').filter(item => item !== ''));
    
    data.forEach((line, index) => {
        if (line[2] === INC_TEXT) {
            data[index][1] += ',' + INC_TEXT;
            data[index] = data[index].filter(item => item !== INC_TEXT);
        }
    });

    RESPONSE_DICT[RESPONSE_STOCKS] = data.map(
        line => insertValuesOnDictionary({ ...COMPANY_DICT }, line, ':')
    );
    return RESPONSE_DICT;
}

function removeAllSymbols(data) {
    return data.map(
        line => {
            let modifiedLine = '';
            for (let i = 0; i < line.length; i++) 
            {
                const char = line[i];
                if (SYMBOLS.includes(char)) {
                    modifiedLine += '';
                } else {
                    modifiedLine += char;
                }
            }
            return modifiedLine;
        }
    );
}

module.exports = parser;
