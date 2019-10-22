'use strict';

const path          = require('path');
const fs            = require('fs');
const crypto        = require('crypto');

const Models        = require('../models');
const mandrill      = require('../services/mandrill');
const CloudPayments = require('../services/cloudpayments');

/**
 * Decode file to Base64 string
 *
 * @param file
 * @return {string|null}
 * @private
 */
let decodeFile_ = (file) => {
    try {
        return fs.readFileSync(file, { encoding: 'base64' });
    } catch (err) {
        return null
    }
};


/**
 * Get status string
 *
 * @param status
 * @private
 */
let getStatusSting_ = (status) => {
    switch (status) {
        case 0: return "Created";
        case 1: return "Pending";
        case 2: return "Confirmed";
        case 3: return "Charged";
        case 4: return "Rebounded";
        case 5: return "Canceled";
        default: return "Error";
    }
};


/**
 * Send order status to admin email.
 *
 * @param order
 * @return {*}
 * @private
 */
let sendOrderStatusToAdmin_ = async (order) => {

    let park = await Models.Park.findOne({
        prefix: order.parkPrefix
    }, {
        name: true
    });

    let ticket = await Models.Ticket.findById(order.ticketId, {
        title: true
    });

    await mandrill.sendOrderStatusEmail({
        order: order.parkPrefix + '-' + order.realId,
        status: getStatusSting_(order.status).toLowerCase(),
        userId: order.userId,
        createdAt: order.createdAt,
        visitDate: order.startDate,
        location: park.name,
        ticket: ticket.title,
        contact: order.contactInfo,
        amount: order.totalPrice
    });
};


/**
 * Check if user has order
 *
 * @param orderId
 * @param userId
 * @return {Promise}
 * @private
 */
let checkOrderUser_ = async (orderId, userId) => {
    return Models.Order.findOne({
        _id: orderId,
        userId: userId
    })
};


/**
 * Get order by ID
 *
 * @param id - order ID
 * @param secret {string} = `LastnameFirstname` of the leader,
 *               {null} for JWT
 * @returns {*}
 * @private
 */
let getOrder_ = async (id, secret) => {
    let order = await Models.Order.findById(id, {
        _id: true,
        realId: true,
        guests: true,
        status: true,
        ticketId: true,
        parkAlias: true,
        parkPrefix: true,
        totalPrice: true,
        tickets: true,
        discount: true,
        contactInfo: true,
        startDate: true,
        createdAt: true
    });

    if (!order) return "not-found";

    order = order.toJSON();

    if (secret) {
        let leader = order.guests.find(item => item.isLead);
        if (secret.toLowerCase() !== (leader.lastName + leader.firstName).toLowerCase()) {
            return "incorrect-secret"
        }
    }

    let ticket = await Models.Ticket.findById(order.ticketId, {
        _id: true,
        title: true,
        days: true,
        adultPrice: true,
        childrenPrice: true
    });

    let park = await Models.Park.findOne({
        prefix: order.parkPrefix
    },{
        prefix: true,
        alias: true,
        name: true,
        location: true,
        logo: true,
        image: true
    });

    park.logo = process.env.API_URL + park.logo;
    park.image = process.env.API_URL + park.image;

    // Not allow to show all files in UI
    delete order.tickets;

    // Logic for allow cancel order by user
    order.canCancel = (
        new Date(+order.startDate - 24 * 60 * 60 * 1000) >= new Date() &&
        order.status <= 1
    );

    return {
        order: order,
        ticket: ticket,
        park: park
    }
};


/**
 * Get real order ID or create id not exist
 *
 * @return {Promise<number>}
 */
const getRealOrderId = async () => {
    let realId = await Models.Counter.findOneAndUpdate(
        { _id: 'orderId' },
        { $inc: { value: 1 } }
    );
    // Create if not exist
    if (!realId) {
        realId = new Models.Counter({
            _id: 'orderId'
        });
        realId = await realId.save();
    }
    return parseInt(realId.value) + 1;
};


/**
 * Create order from site
 *
 * @param data
 * @returns {*}
 * @private
 */
let createOrder_ = async (data) => {

    // Check if ticket is valid
    let ticket = await Models.Ticket.findById(data.ticketId, {
        _id: true,
        days: true,
        title: true,
        adultPrice: true,
        childrenPrice: true
    });

    if (!ticket)
        return "invalid-ticket";

    let park = await Models.Park.findOne({
        alias: data.parkAlias
    },{
        prefix: true,
        alias: true,
        name: true,
        image: true,
        logo: true
    });

    if (!park)
        return "invalid-park";

    let realId = await getRealOrderId();

    let user = await Models.User.findOne({
        email: data.user.email
    }, {
        _id: true,
        email: true,
        firstName: true,
        lastName: true
    });

    let adultLead = data.guests.filter(item => item.isLead === true)[0];

    if (!user) {
        user = new Models.User({
            email: data.user.email,
            lastName: adultLead.lastName,
            firstName: adultLead.firstName,
            password: crypto.createHmac('sha256', process.env.PASSWORD_SECRET)
              .update(data.user.password.trim()).digest('hex')
        });
        await user.save()
    }

    let adultsNum = data.guests.filter(item => item.isAdult);
    let childrenNum = data.guests.filter(item => !item.isAdult);
    let discount = parseFloat(data.discount) || 0;

    let totalPrice = (
        Math.ceil(ticket.adultPrice * (1 - discount)) * adultsNum.length +
        Math.ceil(ticket.childrenPrice * (1 - discount)) * childrenNum.length
    );

    let endDate = new Date(data.visitDate);
    endDate.setDate(endDate.getDate() + ticket.days);

    let order = new Models.Order({
        realId: realId,
        parkPrefix: park.prefix,
        parkAlias: park.alias,
        ticketId: ticket._id,
        userId: user._id,
        locale: data.locale,
        totalPrice: totalPrice,
        discount: discount,
        startDate: data.visitDate,
        endDate: endDate,
        guests: data.guests,
        status: 0,
        paymentDetails: data.paymentDetails,
        contactInfo: data.contactInfo
    });

    await order.save();

    await mandrill.sendPendingEmail({
        locale: order.locale,
        email: user.email,
        name: user.firstName + " " + user.lastName,
        vars: {
            ORDER_NUMBER: order.parkPrefix + "-" + order.realId,
            PARK_NAME: park.name[order.locale],
            PARK_IMAGE: process.env.API_URL + park.image,
            PARK_LOGO: process.env.API_URL + park.logo,
            TICKET_PRICE: '$' + order.totalPrice,
            TICKET_TITLE: ticket.title[order.locale],
            TICKET_DATE: order.startDate,
            TICKET_GUESTS: order.guests.length,
            DETAILS_LINK: process.env.HOMEPAGE + `/order/${order._id}`,
            CURRENT_YEAR: new Date().getFullYear()
        }
    });

    return order;
};


/**
 * Get orders statistics
 *
 * @return {*}
 * @private
 */
let getStatistics_ = async () => {
    return {
        upcoming: await Models.Order.countDocuments({
            startDate: { $gt: new Date() },     // startDate < now
            status: { $nin: [ 0, 4, 5 ] }       // not refunded|canceled
        }) || 0,
        ongoing: await Models.Order.countDocuments({
            status: { $nin: [ 0, 4, 5 ] },      // not refunded|canceled
            endDate: { $gte: new Date() },      // startDate >= now >= endDate
            startDate: { $lte: new Date() }
        }) || 0,
        completed: await Models.Order.countDocuments({
            endDate: { $lt: new Date() },       // endDate > now
            status: { $nin: [ 0, 4, 5 ] }       // not refunded|canceled
        }) || 0,
        canceled: await Models.Order.countDocuments({
            status: { $in: [ 4, 5 ] }           // only refunded|canceled
        }) || 0
    }
};


/**
 * Get all orders
 *
 * @param query = {type: 'upcoming|ongoing|completed'}
 * @return {*}
 * @private
 */
let getAllOrders_ = async (query) => {

    let queryParams = {};

    if (query.type) {
        switch (query.type.toLowerCase()) {
            case 'upcoming':
                queryParams.startDate = { $gt: new Date() };    // startDate < now
                queryParams.status = { $nin: [ 0, 4, 5 ] };     // not refunded|canceled
                break;
            case 'ongoing':
                queryParams.endDate = { $gte: new Date() };     // startDate >= now >= endDate
                queryParams.startDate = { $lte: new Date() };
                queryParams.status = { $nin: [ 0, 4, 5 ] };     // not refunded|canceled
                break;
            case 'completed':
                queryParams.endDate = { $lt: new Date() };      // endDate > now
                queryParams.status = { $nin: [ 0, 4, 5 ] };     // not refunded|canceled
                break;
            case 'canceled':
                queryParams.status = { $in: [ 4, 5 ] };         // only refunded|canceled
                break;
        }
    }

    let orders = await Models.Order.find(queryParams, {
        locale: false,
        parkAlias: false,
        paymentDetails: false,
        updatedAt: false,
        __v: false
    });

    let parksObj = {};
    let parks = await Models.Park.find({
        prefix: {
            $in: orders.map(item => item.parkPrefix)
        }
    },{
        name: true,
        location: true,
        prefix: true
    });

    parks.forEach(item => {
        parksObj[item.prefix] = item
    });

    let ticketsObj = {};
    let tickets = await Models.Ticket.find({
        _id: {
            $in: orders.map(item => item.ticketId)
        }
    },{
        _id: true,
        title: true,
        adultPrice: true,
        childrenPrice: true
    });

    tickets.forEach(item => {
        ticketsObj[item._id] = item
    });

    return orders.map(item => {
        return Object.assign({
            park: parksObj[item.parkPrefix],
            ticket: ticketsObj[item.ticketId],
        }, item.toJSON());
    })
};


/**
 * Update order
 *
 * @param id
 * @param data
 * @return {*}
 * @private
 */
let updateOrder_ = async (id, data) => {
    let order = await Models.Order.findById(id, {
        locale: false,
        parkAlias: false,
        paymentDetails: false,
        updatedAt: false,
        __v: false
    });

    if (!order) return;

    order.guests = data.guests || order.guests;

    if (data.contactInfo) {
        order.contactInfo.email = data.contactInfo.email || order.contactInfo.email;
        order.contactInfo.phone = data.contactInfo.phone || order.contactInfo.phone;
    }

    await order.save();

    let park = await Models.Park.findOne({
        prefix: order.parkPrefix
    },{
        name: true,
        location: true,
        prefix: true
    });

    let ticket = await Models.Ticket.findById(order.ticketId,{
        _id: true,
        title: true,
        adultPrice: true,
        childrenPrice: true
    });

    return Object.assign({
        park: park,
        ticket: ticket
    }, order.toJSON());
};


/**
 * Cancel order
 *
 * @param id
 * @return {*}
 * @private
 */
let cancelOrder_ = async (id) => {
    let order = await Models.Order.findById(id);
    if (!order) return "not-found";

    // If order was charged
    if (order.status === 3) return "order-charged";
    // If order was refunded
    if (order.status === 4) return "order-refunded";
    // If order was canceled
    if (order.status === 5) return "order-canceled";

    order.status = 5;

    let status = await CloudPayments.cancelPayment(order.paymentDetails.transactionId);

    // If payment system returns some error
    if (!status || status && !status.Success) return "payment-error";

    await order.save();

    // Send cancellation email
    if (order.contactInfo && order.contactInfo.email) {
        let leadGuest = order.guests.find(item => item.isLead) || {};
        let user = {
            firstName: leadGuest.firstName || (order.locale === "ru" ? "Гость" : "Guest"),
            lastName: leadGuest.lastName || ""
        };
        await mandrill.sendUnsuccessfulEmail({
            locale: order.locale,
            email: order.contactInfo.email,
            name: user.firstName + " " + user.lastName,
            vars: {
                ORDER_NUMBER: order.parkPrefix + "-" + order.realId,
                CURRENT_YEAR: new Date().getFullYear()
            }
        });
    }

    await sendOrderStatusToAdmin_(order);

    return 'ok'
};


/**
 * Charge order
 *
 * @param id
 * @return {*}
 * @private
 */
let chargeOrder_ = async (id) => {
    let order = await Models.Order.findById(id);
    if (!order) return;

    // If order was refunded
    if (order.status === 4) return "order-refunded";
    // If order was canceled
    if (order.status === 5) return "order-canceled";

    let status = await CloudPayments.confirmPayment(order.paymentDetails.transactionId, order.totalPrice);

    // If payment system returns some error
    if (!status || status && !status.Success) return "payment-error";

    order.status = 3;

    await order.save();

    await sendOrderStatusToAdmin_(order);

    return 'ok'
};


/**
 * Refund order
 *
 * @param id
 * @return {*}
 * @private
 */
let refundOrder_ = async (id) => {
    let order = await Models.Order.findById(id);
    if (!order) return;

    // If order was canceled
    if (order.status === 5) return "order-canceled";

    let status = await CloudPayments.refundPayment(order.paymentDetails.transactionId, order.totalPrice);

    // If payment system returns some error
    if (!status || status && !status.Success) return "payment-error";

    order.status = 4;

    await order.save();

    await sendOrderStatusToAdmin_(order);

    return 'ok'
};


/**
 * Add file to the order
 *
 * @param id
 * @param file
 * @return {*}
 * @private
 */
let addFile_ = async (id, file) => {
    let order = await Models.Order.findById(id);
    if (!order) return "no-order";

    let format = null;
    switch (file.mimetype) {
        case "image/png": format = "png"; break;
        case "image/jpeg": format = "jpeg"; break;
        case "image/jpg": format = "jpg"; break;
        case "application/pdf": format = "pdf"; break;
    }

    if (!format) return "invalid-format";

    let hash = crypto.createHmac('sha256', process.env.APP_SECRET)
      .update(file.name + +new Date()).digest('hex');
    let data = {
        name: file.name,
        mimetype: file.mimetype,
        path: hash + "." + format,
        current: false
    };

    let dirPath = path.resolve(process.env.FILES_STORAGE + "/" + order._id);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }

    await file.mv(
        path.resolve(dirPath + "/" + data.path)
    );

    order.tickets.push(data);

    await order.save();

    return data;

};


/**
 * Delete file from the order
 *
 * @param id
 * @param filePath
 * @return {*}
 * @private
 */
let deleteFile_ = async (id, filePath) => {
    let order = await Models.Order.findById(id);
    if (!order) return "no-order";

    let fullPath = path.resolve(process.env.FILES_STORAGE + "/" + order._id + "/" + filePath);

    try {
        fs.unlinkSync(fullPath)
    } catch (err) {
        console.error(`File [${fullPath}] does not exist`)
    }

    for (let i = 0; i < order.tickets.length; i++) {
        if (order.tickets[i].path === filePath) {
            order.tickets.splice(i, 1);
            break;
        }
    }

    await order.save();
    return "ok";
};


/**
 * Send tickets based on method type
 *
 * @param id
 * @param data  = {method: 'email|phone', current: 'file path to send'}
 * @return {string}
 * @private
 */
let sendTickets_ = async (id, data) => {
    let order = await Models.Order.findById(id);
    if (!order) return "no-order";

    let park = await Models.Park.findOne({
        prefix: order.parkPrefix
    },{
        name: true,
        image: true,
        logo: true
    });

    let leadGuest = order.guests.find(item => item.isLead) || {};
    let user = {
        firstName: leadGuest.firstName || (order.locale === "ru" ? "Гость" : "Guest"),
        lastName: leadGuest.lastName || ""
    };

    let ticket = await Models.Ticket.findOne({
        _id: order.ticketId
    },{
        title: true
    });

    let dirPath = path.resolve(process.env.FILES_STORAGE + "/" + order._id);

    order.tickets = order.tickets.map(item => {
        item.current = item.path === data.current;
        return item
    });

    let attachments = order.tickets.filter(
        item => item.current
    ).map(item => {
        return {
            type: item.type,
            name: item.name,
            content: decodeFile_(path.resolve(dirPath + "/" + item.path))
        }
    }).filter(
        item => item.content !== null
    );

    switch (data.method) {
        case 'email':
            await mandrill.sendConfirmedEmail({
                locale: order.locale,
                email: order.contactInfo.email,
                name: user.firstName + " " + user.lastName,
                vars: {
                    ORDER_NUMBER: order.parkPrefix + "-" + order.realId,
                    PARK_NAME: park.name[order.locale],
                    PARK_IMAGE: process.env.API_URL + park.image,
                    PARK_LOGO: process.env.API_URL + park.logo,
                    TICKET_PRICE: '$' + order.totalPrice,
                    TICKET_TITLE: ticket.title[order.locale],
                    TICKET_DATE: order.startDate,
                    TICKET_GUESTS: order.guests.length,
                    DOWNLOAD_LINK: process.env.HOMEPAGE + `/order/${order._id}`,
                    CURRENT_YEAR: new Date().getFullYear()
                },
                attachments: attachments
            });
            break;
        case 'phone':
            break;
        default:
            return "unsupported-method";
    }

    // Status confirmed
    order.status = 2;
    await order.save();

    return "ok"
};


/**
 * Get my orders
 *
 * @param id
 * @return {Promise}
 * @private
 */
let getMyOrders_ = async (id) => {
    let orders = await Models.Order.find({
        userId: id
    },{
        parkAlias: false,
        updatedAt: false,
        tickets: false,
        contactInfo: false,
        paymentDetails: false,
    });

    let parksObj = {};
    let parks = await Models.Park.find({
        prefix: {
            $in: orders.map(item => item.parkPrefix)
        }
    },{
        name: true,
        location: true,
        alias: true,
        prefix: true,
        logo: true,
        image: true
    });

    parks.forEach(item => {
        parksObj[item.prefix] = item
    });

    let ticketsObj = {};
    let tickets = await Models.Ticket.find({
        _id: {
            $in: orders.map(item => item.ticketId)
        }
    },{
        _id: true,
        parkAlias: true,
        days: true,
        title: true,
        adultPrice: true,
        childrenPrice: true
    });

    tickets.forEach(item => {
        ticketsObj[item._id] = item
    });

    return orders.map(item => {
        item = item.toJSON();
        let park = parksObj[item.parkPrefix].toJSON();
        park.logo = process.env.API_URL + park.logo;
        park.image = process.env.API_URL + park.image;
        return Object.assign({
            ticket: ticketsObj[item.ticketId],
            park: park
        }, item)
    })
};


/**
 * Get order ticket
 *
 * @param id - order ID
 * @param filePath - ticket file path, only for ADMIN
 * @param secret - secret for retrieve file when non auth user
 * @return {Promise}
 * @private
 */
let getOrderTicket_ = async (id, filePath = null, secret = null) => {
    let order = await Models.Order.findById(id, {
        _id: true,
        guests: true,
        tickets: true
    });

    if (!order) return;

    let currentTicket = order.tickets.find(item => item.current);

    // If admin => return order by filePath
    if (filePath)
        currentTicket = order.tickets.find(item => item.path === filePath);

    // If no auth user => check secret
    if (secret) {
        let leadTraveler = order.guests.find(item => item.isLead);
        if (secret.toLowerCase() !== (leadTraveler.lastName + leadTraveler.firstName).toLowerCase())
            return
    }

    return {
        name: currentTicket.name,
        path: path.resolve(process.env.FILES_STORAGE + "/" + order._id + "/" + currentTicket.path)
    };
};


module.exports = {
    checkOrderUser: checkOrderUser_,
    getOrder: getOrder_,
    createOrder: createOrder_,
    getStatistics: getStatistics_,
    getAllOrders: getAllOrders_,
    updateOrder: updateOrder_,
    cancelOrder: cancelOrder_,
    chargeOrder: chargeOrder_,
    refundOrder: refundOrder_,
    addFile: addFile_,
    deleteFile: deleteFile_,
    sendTickets: sendTickets_,
    getMyOrders: getMyOrders_,
    getOrderTicket: getOrderTicket_
};