'use strict';

const jwt       = require('jsonwebtoken');
const crypto    = require('crypto');

const Models    = require('../models');
const mandrill  = require('../services/mandrill');


/**
 * Register new user
 *
 * @param data
 * @returns {Promise}
 * @private
 */
let register_ = async (data) => {
    let password = crypto.createHmac('sha256', process.env.PASSWORD_SECRET).update(data.password.trim()).digest('hex');
    let msg = new Models.User({
        email: data.email,
        lastName: data.lastName,
        firstName: data.firstName,
        password: password
    },{
        password: false
    });

    return msg.save()
        .then(async user => {
            // Generate link
            let hash = await createConfirmationLink_(user);
            // TODO: send email with confirmation link
            console.log(hash);

            return {
                user: user,
                tokens: {
                    accessToken: await generateToken_('access', user),
                    refreshToken: await generateToken_('refresh', user)
                }
            }
        })
        .catch(err => {
            return { error: err.errmsg }
        })
};


/**
 * Login - create tokens
 *
 * @param data
 * @returns {*}
 * @private
 */
let login_ = async (data) => {
    let user = await Models.User.findOne({
        email: data.email,
        isActivated: true,
        password: crypto.createHmac('sha256', process.env.PASSWORD_SECRET).update(data.password.trim()).digest('hex')
    },{
        password: false
    });

    if (!user)
        return { error: "Not found" };

    return {
        user: user,
        tokens: {
            accessToken: await generateToken_('access', user),
            refreshToken: await generateToken_('refresh', user)
        }
    }
};


/**
 * Handle logout event. Delete refresh token
 *
 * @param data
 * @return {*}
 * @private
 */
let logout_ = async (data) => {
    if (data.refreshToken) {
        await Models.Token.findOneAndRemove({
            type: 'jwt',
            token: data.refreshToken
        });
    }
};


/**
 * Create token by type.
 *
 * @param type - access|refresh
 * @param user - Model_User
 * @returns {String}
 * @private
 */
let generateToken_ = async (type, user) => {

    let token = null;

    if (type === "refresh") {
        token = await jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_REFRESH_SECRET, {
            algorithm: "HS256",
            expiresIn: process.env.JWT_REFRESH_EXPIRE
        });
        let msg = new Models.Token({
            type: 'jwt',
            userId: user._id,
            token: token
        });
        msg.save();
    }

    if (type === "access") {
        token = await jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_ACCESS_SECRET, {
            algorithm: "HS256",
            expiresIn: process.env.JWT_ACCESS_EXPIRE
        });
    }

    return token;
};


/**
 * Refresh tokens
 *      - if !refresh token or exp refresh token date is not valid => return error
 *      - else create new access and refresh tokens
 *
 * @param refreshToken {String} - JWT token
 * @returns {Object}
 * @private
 */
let refreshTokens_ = async (refreshToken) => {

    let decode = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, { ignoreExpiration: true });

    if (decode.exp < (+new Date() / 1000 - 30))
        return "expired";

    let token = await Models.Token.findOne({
        type: 'jwt',
        token: refreshToken
    });

    if (!token)
        return "expired";

    let user = await Models.User.findOne({
        _id: token.userId
    },{
        password: false
    });

    if (!user)
        return "error";

    token.remove();

    return {
        accessToken: await generateToken_('access', user),
        refreshToken: await generateToken_('refresh', user)
    }
};


/**
 * Confirm email
 *
 * @param hash
 * @returns {Promise}
 * @private
 * TODO
 */
let confirmEmail_ = async (hash) => {
    let userId = await checkConfirmationLink_(hash);

    if (!userId) return "invalid-hash";

    // TODO Retrieve user by ID
    let user = null;

    if (!user) return "deleted";

    await deleteConfirmationLink_(hash, user.id);

    return {
        accessToken: await generateToken_('access', user),
        refreshToken: await generateToken_('refresh', user)
    }
};


/**
 * Generate confirmation link and store it in Redis.
 *
 * @param user - Model_User
 * @returns {String}
 * @private
 */
let createConfirmationLink_ = async (user) => {
    let hash = crypto.createHmac('sha256', process.env.APP_SECRET).update(user._id + +new Date()).digest('hex');
    let msg = new Models.Token({
        type: 'confirm',
        userId: user._id,
        token: hash
    });
    await msg.save();
    return hash;
};


/**
 * Check confirmation link
 *
 * @param hash {String}
 * @returns userId|null
 * @private
 */
let checkConfirmationLink_ = async (hash) => {
    return Models.Token.findOne({
        type: 'confirm',
        token: hash
    });
};


/**
 * Delete confirmation link
 *
 * @param hash {String}
 * @param userId
 * @private
 */
let deleteConfirmationLink_ = async (hash, userId) => {
    return Models.Token.findOneAndRemove({
        type: 'confirm',
        userId: userId,
        token: hash
    });
};


/**
 * Reset password
 *
 * @param data {JSON}
 * @returns {Promise}
 * @private
 * TODO
 */
let resetPassword_ = async (data) => {

    let user = await Models.User.findOne({
        email: data.email
    },{
        password: false
    });

    if (!user) return null;

    let hash = await createResetLink_(user);

    await mandrill.sendResetEmail({
        locale: data.locale || "en",
        email: user.email,
        name: user.firstName + " " + user.lastName,
        vars: {
            RESET_LINK: process.env.RECOVERY_PAGE + "?hash=" + hash,
            CURRENT_YEAR: new Date().getFullYear()
        }
    });

    return "success";
};


/**
 * Recovery access to account
 *
 * @param data {JSON}
 * @returns {Promise}
 * @private
 */
let recoveryAccess_ = async (data) => {

    let tokenData = await checkResetLink_(data.hash);

    if (!tokenData) return;

    let password = crypto.createHmac('sha256', process.env.PASSWORD_SECRET).update(data.password).digest('hex');

    let user = await Models.User.findOneAndUpdate({
        _id: tokenData.userId
    }, {
        password: password
    } );

    await deleteResetLink_(data.hash, user._id);

    return {
        user: user,
        tokens: {
            accessToken: await generateToken_('access', user),
            refreshToken: await generateToken_('refresh', user)
        }
    }
};

/**
 * Generate reset link and store it in Redis.
 *
 * @param user - Model_User
 * @returns {String}
 * @private
 */
let createResetLink_ = async (user) => {
    let hash = crypto.createHmac('sha256', process.env.APP_SECRET).update(user._id + +new Date()).digest('hex');
    let msg = new Models.Token({
        type: 'reset',
        userId: user._id,
        token: hash
    });
    await msg.save();
    return hash;
};


/**
 * Check reset link
 *
 * @param hash {String}
 * @returns userId|null
 * @private
 */
let checkResetLink_ = async (hash) => {
    return Models.Token.findOne({
        type: 'reset',
        token: hash,
        createdAt: {
            $gte: new Date( +new Date() - parseInt(process.env.RESET_EXPIRE) )
        }
    });
};


/**
 * Delete reset link
 *
 * @param hash {String}
 * @param userId
 * @private
 */
let deleteResetLink_ = async (hash, userId) => {
    return Models.Token.findOneAndRemove({
        type: 'reset',
        userId: userId,
        token: hash
    });
};


module.exports = {
    register: register_,
    login: login_,
    logout: logout_,
    refreshTokens: refreshTokens_,
    resetPassword: resetPassword_,
    confirmEmail: confirmEmail_,
    recoveryAccess: recoveryAccess_
};