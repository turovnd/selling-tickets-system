'use strict';

const URL           = require('url');
const Models        = require('../models');
const CloudPayments = require('../services/cloudpayments');

const allowedQueries = ['userid', 'ticket', 'maxpass'];


/**
 * Normalize url by removing not allowed queries fields.
 *
 * @param href
 * @return {*}
 */
const normalizeUrl = (href) => {
    let link = URL.parse(href);         // eslint-disable-line node/no-deprecated-api
    if (!link.query) return href;
    let params = link.query.split("&").map(item => item.split('='));
    let fields = [];
    let values = [];
    for (let i = 0; i < params.length; i++) {
        let field = params[i][0].toLowerCase();
        let value = params[i][1];
        if (value && value !== "" && fields.indexOf(field) === -1 && allowedQueries.indexOf(field) > -1) {
            fields.push(field);
            values.push(value);
        }
    }
    let result = [];
    for (let i in fields) {
        result.push(fields[i] + "=" + values[i])
    }
    return link.protocol + "//" + link.host + link.pathname + "?" + result.join('&');
};


/**
 * Make payment request.
 *
 * @param data  = { orderId: '', requestFrom: '', ipAddress: '', cardHolder: '', packet: '' }
 * @return {*}
 * @private
 */
let makePayment_ = async (data) => {

    let order = await Models.Order.findById(data.orderId);
    if (!order) return 'no-order';

    if (order.status > 0) return 'already-paid';

    order.paymentDetails.requestFrom = normalizeUrl(data.requestFrom);

    await order.save();

    let ticket = await Models.Ticket.findById(order.ticketId);
    if (!ticket) return 'no-ticket';

    let result = await CloudPayments.authorizeCryptogramPayment({
        locale: order.locale,
        amount: order.totalPrice,
        ipAddress: data.ipAddress,
        cardHolder: data.cardHolder,
        packet: data.packet,
        orderId: order.parkPrefix + "-" + order.realId,
        description: ticket.title['en'],
        userId: order.userId,
        email: order.contactInfo ? order.contactInfo.email : null
    });

    if (!result || !result.Model) return 'payment-creation';

    order.paymentDetails.transactionId = result.Model.TransactionId;
    order.paymentDetails.status = result.Success;
    order.paymentDetails.reason = result.Model.ReasonCode;

    if (result.Success) {
        order.paymentDetails.cardFirstSix = result.Model.CardFirstSix;
        order.paymentDetails.cardLastFour = result.Model.CardLastFour;
        order.paymentDetails.cardExpDate = result.Model.CardExpDate;
        order.status = 1;
    }

    await order.save();

    return {
        status: result.Success,
        reason: result.Model.ReasonCode,
        reasonMessage: result.Model.CardHolderMessage,
        transactionId: result.Model.TransactionId,
        paReq: result.Model.PaReq || null,
        acsUrl: result.Model.AcsUrl || null,
        termUrl: process.env.API_URL + "/" + process.env.API_VERSION + "/payments/callback/" + order._id
    }
};


/**
 * Confirm 3DS Payment
 *
 * @param id => order ID
 * @param data
 * @return {*}
 * @private
 */
let confirm3DPayment_ = async (id, data) => {
    let order = await Models.Order.findById(id);

    if (!order)
        return process.env.HOMEPAGE + "/payments?code=9999";

    let result = await CloudPayments.confirm3DSPayment({
        locale: order.locale,
        transactionId: data.MD,
        paRes: data.PaRes
    });

    let secret = order.guests.find(item => item.isLead);
    secret = secret.lastName + secret.firstName;

    if (!result) {
        return process.env.HOMEPAGE + `/confirmation?order=${order._id}&secret=${secret}` +
          `&status=${result.Success}&reasonMessage=Undefined error`;
    }

    order.paymentDetails.status = result.Success;

    order.paymentDetails.transactionId = result.Model.TransactionId;
    order.paymentDetails.reason = result.Model.ReasonCode;

    if (result.Success) {
        order.paymentDetails.cardFirstSix = result.Model.CardFirstSix;
        order.paymentDetails.cardLastFour = result.Model.CardLastFour;
        order.paymentDetails.cardExpDate = result.Model.CardExpDate;
        order.status = 1;
    }

    await order.save();

    // If site + success -> redirect to confirmation page
    if (result.Success) {
        return process.env.HOMEPAGE + `/confirmation?order=${order._id}&secret=${secret}` +
          `&status=${result.Success}&reasonMessage=${result.Model.CardHolderMessage}`
    }

    // If site + error -> redirect to order page
    return process.env.HOMEPAGE + `/order?order=${order._id}&secret=${secret}` +
      `&status=${result.Success}&reasonMessage=${result.Model.CardHolderMessage}`
};


/**
 * Confirm payment by cloudpayment request
 *
 * @param data
 * @private
 * @link https://developers.cloudpayments.ru/#confirm
 */
let confirmPayment_ = async (data) => {
    let order = await Models.Order.findOne({
        'paymentDetails.transactionId': data.TransactionId,
        totalPrice: parseInt(data.Amount)
    });

    if (!order) return 404;

    order.status = 3;
    order.paymentDetails.cardFirstSix = data.CardFirstSix;
    order.paymentDetails.cardLastFour = data.CardLastFour;
    order.paymentDetails.cardExpDate = data.CardExpDate;

    await order.save();

    return 0;
};


module.exports = {
    makePayment: makePayment_,
    confirm3DPayment: confirm3DPayment_,
    confirmPayment: confirmPayment_
};