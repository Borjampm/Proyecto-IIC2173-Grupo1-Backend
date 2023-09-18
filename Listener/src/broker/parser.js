let { RESPONSE_DICT, COMPANY_DICT, RESPONSE_ALL_KEYS } = require('../parameters/response_values');

const SYMBOLS = ['"', '{', '}', '\\'];

function valuesAsDict(dict, lines, symbols) {
    for (const line of lines) {
        const [key, values] = line.split(symbols);
        dict[key] = values;
    }
    return dict;
}

function parser(dataAsString) {
    let data = dataAsString.split('}');
    data = data.filter(line => RESPONSE_ALL_KEYS.some(key => line.includes(key)));

    const stocksIndex = data.findIndex(line => line.includes('stocks_id'));

    let lines = data[stocksIndex].split(',');
    data.splice(stocksIndex, 1);
    lines = lines.filter(line => RESPONSE_ALL_KEYS.some(key => line.includes(key)));

    RESPONSE_DICT = valuesAsDict(RESPONSE_DICT, removeAllSymbols(lines), ':');

    data[0] = data[0].replace(`"${'stocks'}":"[`, '');
    data = removeAllSymbols(data);
    data = data.map(line => line.split(',').filter(item => item !== ''));
    
    data.forEach((line, index) => {
        if (line[2] === ' Inc.') {
            data[index][1] += ',' + ' Inc.';
            data[index] = data[index].filter(item => item !== ' Inc.');
        }
    });

    RESPONSE_DICT['stocks'] = data.map(line => valuesAsDict({ ...COMPANY_DICT }, line, ':'));
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
