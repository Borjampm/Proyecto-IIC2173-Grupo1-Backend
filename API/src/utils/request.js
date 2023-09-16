function getStartIndex(page, size) {
    return (page - 1) * size;
}

function getEndIndex(page, size) {
    return page * size;
}

module.exports = { getStartIndex, getEndIndex };