'use strict';

const Models   = require('../models');

/**
 * Get ticket by id
 *
 * @param ticketId
 * @returns {Promise}
 * @private
 */
let getTicketById_ = async (ticketId) => {
    return Models.Ticket.findById(ticketId)
        .then(doc => doc.toJSON())
        .catch(() => null)
};


module.exports = {
    getTicketById: getTicketById_
};