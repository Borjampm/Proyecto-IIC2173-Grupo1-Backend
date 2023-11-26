const { v4: uuidv4, validate, parse } = require('uuid');

function messageTypeNotValid(type) {
    return !(type === "proposal" || type === "offer" || type === "acceptance" || type === "rejection");
}

function messageDontContainAllFields(message) {
    return (
        message.auction_id == null ||
        message.stock_id == null ||
        message.quantity == null ||
        message.group_id == null ||
        message.type == null
    );
}

function fixAuction(message) {
    if (
        messageDontContainAllFields(message) ||
        messageTypeNotValid(message.type)
    ) {
        return null;
    }

    if (message.proposal_id === "") {
        if (message.type === "offer") {
            message.proposal_id = null;
        } else {
            return null;
        }
    }

    if (!validate(message.proposal_id) && message.proposal_id != null) {
        message.proposal_id = parse(message.proposal_id);
    }
    if (!validate(message.auction_id)) {
        message.auction_id = parse(message.auction_id);
    }

    message.quantity = parseInt(message.quantity);
    message.group_id = parseInt(message.group_id);

    return message;
}

module.exports = fixAuction;
