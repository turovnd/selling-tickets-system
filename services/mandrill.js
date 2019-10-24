/**
 * Mandrill client
 *
 * @link: https://www.npmjs.com/package/mandrill-api
 */

const path              = require('path');

const mandrill          = require('mandrill-api/mandrill');
const mandrillClient    = new mandrill.Mandrill( process.env.MANDRILL_API_KEY);

const i18nFolder        = path.join(__dirname, '..', 'emails-templates');


/**
 * Get date string based on locale.
 *
 * @param date
 * @param locale
 */
let getDateString = (date, locale) => {
    let calendar = require(path.join(i18nFolder, '..', 'calendar.js'));
    if (!(date instanceof Date)) {
        date = new Date(date)
    }
    if (!calendar || calendar && !calendar[locale])
        return date.toLocaleDateString();

    return date.getDate() + " " + calendar[locale].pluralMonths[date.getMonth()] + " " + date.getFullYear()
};


/**
 * Get variables in mandrill format.
 *
 * @param vars
 * @return {Array}
 */
const getVars = (vars) => {
    let results =[];
    Object.keys(vars).map(key => {
        results.push({
            name: key,
            content: vars[key]
        })
    });
    return results;
};

/**
 * Get content vars based on script type and lang
 *
 * @param fileName
 * @param locale
 * @return Array
 */
const getContentVars = (fileName, locale) => {
    let results = [];
    let TRANSLATION = require(path.join(i18nFolder, fileName));
    if (TRANSLATION) {
        Object.keys(TRANSLATION).map(key => {
            results.push({
                name: key,
                content: TRANSLATION[key][locale]
            })
        });
    }
    return results
};



/**
 * Initialize mandrill client
 *
 * @private
 */
let init_ = async () => {
    return new Promise(resolve => {
        mandrillClient.users.ping2({}, () => {
            console.info('Mandrill has initialized');
            resolve()
        }, err => {
            console.error('Mandrill connection error: ' + err.name + ' - ' + err.message);
        } );
    });
};


/**
 * Send confirmed email
 *
 * @param data = { locale: 'ru', email: '', name: '',
 *                  attachments: [], vars: {
 *                  ORDER_NUMBER: '', PARK_NAME: '', PARK_IMAGE: 'url',
 *                  PARK_LOGO: 'url', TICKET_PRICE: '', TICKET_TITLE: '',
 *                  TICKET_DATE: '', TICKET_GUESTS: '',
 *                  DOWNLOAD_LINK: 'url', CURRENT_YEAR: new Date().getFullYear() } }
 * @private
 */
let sendConfirmedEmail_ = (data) => {
    return new Promise(resolve => {
        let globalVars = getContentVars('confirmed.json', data.locale || "en");
        data.vars.TICKET_DATE = getDateString(data.vars.TICKET_DATE, data.locale || "en");
        mandrillClient.messages.sendTemplate({
            template_name: "completed-email",
            template_content: [],
            merge_language: "handlebars",
            message: {
                subject: globalVars
                  .find(item => item.name === 'SUBJECT').content
                  .replace('_VAL_', data.vars.ORDER_NUMBER),
                from_email: process.env.MANDRILL_FROM_EMAIL,
                from_name: process.env.MANDRILL_FROM_NAME,
                to: [{
                    email: data.email,
                    name: data.name,
                    type: "to"
                }],
                important: true,
                track_opens: true,
                global_merge_vars: globalVars,
                merge_vars: [{
                    rcpt: data.email,
                    vars: getVars(data.vars)
                }],
                attachments: data.attachments
            },
            async: true,
            send_at: new Date()
        }, result => {
            resolve(result);
            console.log('Send [confirmed] email to [' + result[0].email + "]");
        }, err => {
            console.error('A mandrill error occurred: ' + err.name + ' - ' + err.message);
            resolve({ error: "Email has not sent"});
        });
    })
};


/**
 * Send pending email
 *
 * @param data = { locale: 'ru', email: '', name: '', vars: {
 *                  ORDER_NUMBER: '', PARK_NAME: '', PARK_IMAGE: 'url',
 *                  PARK_LOGO: 'url', TICKET_PRICE: '', TICKET_TITLE: '',
 *                  TICKET_DATE: '', TICKET_GUESTS: '',
 *                  DETAILS_LINK: 'url', CURRENT_YEAR: new Date().getFullYear() } }
 * @private
 */
let sendPendingEmail_ = (data) => {
    return new Promise(resolve => {
        let globalVars = getContentVars('pending.json', data.locale || "en");
        data.vars.TICKET_DATE = getDateString(data.vars.TICKET_DATE, data.locale || "en");
        mandrillClient.messages.sendTemplate({
            template_name: "pending-email",
            template_content: [],
            merge_language: "handlebars",
            message: {
                subject: globalVars
                  .find(item => item.name === 'SUBJECT').content
                  .replace('_VAL_', data.vars.ORDER_NUMBER),
                from_email: process.env.MANDRILL_FROM_EMAIL,
                from_name: process.env.MANDRILL_FROM_NAME,
                to: [{
                    email: data.email,
                    name: data.name,
                    type: "to"
                }],
                important: true,
                track_opens: true,
                global_merge_vars: globalVars,
                merge_vars: [{
                    rcpt: data.email,
                    vars: getVars(data.vars)
                }]
            },
            async: true,
            send_at: new Date()
        }, result => {
            resolve(result);
            console.log('Send [pending] email to [' + result[0].email + "]");
        }, err => {
            console.error('A mandrill error occurred: ' + err.name + ' - ' + err.message);
            resolve({ error: "Email has not sent"});
        });
    })
};


/**
 * Send unsuccessfully email
 *
 * @param data = { locale: 'ru', email: '', name: '', vars: {
 *                  ORDER_NUMBER: '', CURRENT_YEAR: new Date().getFullYear() } }
 * @private
 */
let sendUnsuccessfulEmail_ = (data) => {
    return new Promise(resolve => {
        let globalVars = getContentVars('unsuccessful.json', data.locale || "en");
        mandrillClient.messages.sendTemplate({
            template_name: "unsuccessful-email",
            template_content: [],
            merge_language: "handlebars",
            message: {
                subject: globalVars
                  .find(item => item.name === 'SUBJECT').content
                  .replace('_VAL_', data.vars.ORDER_NUMBER),
                from_email: process.env.MANDRILL_FROM_EMAIL,
                from_name: process.env.MANDRILL_FROM_NAME,
                to: [{
                    email: data.email,
                    name: data.name,
                    type: "to"
                }],
                important: true,
                track_opens: true,
                global_merge_vars: globalVars,
                merge_vars: [{
                    rcpt: data.email,
                    vars: getVars(data.vars)
                }]
            },
            async: true,
            send_at: new Date()
        }, result => {
            resolve(result);
            console.log('Send [unsuccessful] email to [' + result[0].email + "]");
        }, err => {
            console.error('A mandrill error occurred: ' + err.name + ' - ' + err.message);
            resolve({ error: "Email has not sent"});
        });
    })
};


/**
 * Send reset email
 *
 * @param data = { locale: 'ru', email: '', name: '', vars: {
 *                  RESET_LINK: '', CURRENT_YEAR: new Date().getFullYear() } }
 * @private
 */
let sendResetEmail_ = (data) => {
    return new Promise(resolve => {
        let globalVars = getContentVars('reset.json', data.locale || "en");
        mandrillClient.messages.sendTemplate({
            template_name: "reset-password-email",
            template_content: [],
            merge_language: "handlebars",
            message: {
                subject: globalVars.find(item => item.name === 'SUBJECT').content,
                from_email: process.env.MANDRILL_FROM_EMAIL,
                from_name: process.env.MANDRILL_FROM_NAME,
                to: [{
                    email: data.email,
                    name: data.name,
                    type: "to"
                }],
                important: true,
                track_opens: true,
                global_merge_vars: globalVars,
                merge_vars: [{
                    rcpt: data.email,
                    vars: getVars(data.vars)
                }]
            },
            async: true,
            send_at: new Date()
        }, result => {
            resolve(result);
            console.log('Send [reset] email to [' + result[0].email + "]");
        }, err => {
            console.error('A mandrill error occurred: ' + err.name + ' - ' + err.message);
            resolve({ error: "Email has not sent"});
        });
    })
};


/**
 * Send order status email to Admin
 *
 * @param data
 * @return {*}
 * @private
 */
let sendOrderStatusEmail_ = async (data) => {
    return new Promise(resolve => {
        mandrillClient.messages.send({
            message: {
                subject: `Order: ${data.order} - ${data.status}`,
                html: `<p>Order: <b>${data.order}</b></p>` +
                `<p>Status: <b>${data.status}</b></p>` +
                `<p>User ID: ${data.userId}</p>` +
                `<p>Created at: ${getDateString(data.createdAt, 'en') + data.createdAt.toLocaleTimeString()}</p>` +
                `<p>Trip date: ${getDateString(data.visitDate, 'en')}</p>` +
                `<p>Trip location: ${data.location['en']}</p>` +
                `<p>Contact:</p>` +
                    '<ul><li>Email: ${data.contact.email}</li><li>Phone: ${data.contact.phone}</li></ul>' +
                `<p>Tickets: ${data.ticket['en']}</p>` +
                `<p>Amount: ${data.amount}</p>`,
                from_email: process.env.MANDRILL_FROM_EMAIL,
                from_name: process.env.MANDRILL_FROM_NAME,
                to: [{
                    email: process.env.MANDRILL_FROM_EMAIL,
                    name: process.env.MANDRILL_FROM_NAME,
                    type: "to"
                }],
                track_opens: false,
            },
            async: true,
            send_at: new Date()
        }, result => {
            resolve(result);
        }, err => {
            console.error('A mandrill error occurred: ' + err.name + ' - ' + err.message);
            resolve({error: "Email has not sent"});
        });
    });
};

module.exports = {
    init: init_,
    sendConfirmedEmail: sendConfirmedEmail_,
    sendPendingEmail: sendPendingEmail_,
    sendUnsuccessfulEmail: sendUnsuccessfulEmail_,
    sendResetEmail: sendResetEmail_,
    sendOrderStatusEmail: sendOrderStatusEmail_
};
