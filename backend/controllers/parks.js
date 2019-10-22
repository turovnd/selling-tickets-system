'use strict';

const Models       = require('../models');

const parksOrder   = [ 'DL', 'US', 'SW', 'DLP' ]; // TODO - store in DB


/**
 * Get all parks short description
 *
 * @returns {Promise}
 * @private
 */
let getAll_ = async () => {
    return Models.Park.find({},{
        _id: true,
        name: true,
        alias: true,
        prefix: true,
        logo: true,
        image: true
    })
        .then(async parks => {
            let results = [];
            for (let i in parks) {
                let park = parks[i].toJSON();
                let ticket = await Models.Ticket.findOne({
                    parkAlias: park.alias
                }).sort({ adultPrice: 1 });
                park.minPrice = ticket ? ticket.adultPrice : null;
                results.push(park)
            }
            results = results.sort((a,b) => parksOrder.indexOf(a.prefix) > parksOrder.indexOf(b.prefix));
            return results;
        })
        .catch(() => {
            return null
        });
};


/**
 * Get full park description by link
 *
 * @param link  - file name with park description
 * @returns {Promise}
 * @private
 */
let getOneByLink_ = async (link) => {
    return Models.Park.findOne({
        alias: link
    })
        .then(async doc => {
            let park = doc.toJSON();
            let minDate = new Date();
            minDate.setHours(0,0,0,0);
            minDate.setDate(minDate.getDate() + 2);
            park.minDate = minDate.toISOString();
            park.tickets = await Models.Ticket.find({
                parkAlias: link
            });
            return park;
        })
        .catch(() => null);
};


module.exports = {
    getAll: getAll_,
    getOneByLink: getOneByLink_
};