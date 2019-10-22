'use strict';

const fs            = require('fs');
const path          = require('path');

const crypto        = require('crypto');
const Models        = require('../models');

const avatarURL     = process.env.API_URL + "/avatars/";
const avatarPath    = path.join(__dirname, '..', 'static', 'avatars');

/**
 * Get user by email
 *
 * @param email
 * @returns {Promise}
 * @private
 */
let getByEmail_ = async (email) => {
    return Models.User.findOne({
        email: email
    },{
        password: false
    })
        .then(doc => {
            return {
                email: doc.email
            }
        })
        .catch(() => null)
};


/**
 * Get user by ID
 *
 * @param id
 * @returns {Promise}
 * @private
 */
let getById_ = async (id) => {
    return Models.User.findOne({
        _id: id,
        isActivated: true
    },{
        password: false
    })
        .then(doc => {
            return {
                email: doc.email,
                firstName: doc.firstName,
                lastName: doc.lastName,
                avatar: avatarURL + doc.avatar,
                emailSubscription: doc.emailSubscription,
                isActivated: doc.isActivated,
                emailConfirmed: doc.emailConfirmed
            }
        })
        .catch(() => null)
};


/**
 * Update user
 *
 * @param id
 * @param data
 * @return {Promise}
 * @private
 */
let update_ = async (id, data) => {
    let doc = await Models.User.findById(id, {
        password: false
    });

    if (!doc)
        return "not-found";

    if (data.email !== doc.email) {
        let existEmail = await getByEmail_(data.email);
        if (existEmail)
            return "duplicate-email";
        doc.email = data.email;
    }
    doc.firstName = data.firstName;
    doc.lastName = data.lastName;
    await doc.save();
    return {
        email: doc.email,
        firstName: doc.firstName,
        lastName: doc.lastName,
        avatar: avatarURL + doc.avatar,
        emailSubscription: doc.emailSubscription,
        isActivated: doc.isActivated,
        emailConfirmed: doc.emailConfirmed
    }
};


/**
 * Change password
 *
 * @param id
 * @param data
 * @return {Promise}
 * @private
 */
let changePassword_ = async (id, data) => {

    if (data.newPassword === data.oldPassword)
        return 'same-passwords';

    let doc = await Models.User.findOne({
        _id: id,
        password: crypto.createHmac('sha256', process.env.PASSWORD_SECRET)
          .update(data.oldPassword.trim()).digest('hex')
    });

    if (!doc) return 'old-password-incorrect';

    doc.password = crypto.createHmac('sha256', process.env.PASSWORD_SECRET)
      .update(data.newPassword.trim()).digest('hex');
    await doc.save();

    return 'ok';
};


/**
 * Deactivate account
 *
 * @param id
 * @return {Promise}
 * @private
 */
let deactivate_ = async (id) => {
    return await Models.User.findOneAndUpdate({
        _id: id
    },{
        isActivated: false
    });
};


/**
 * Handle unsubscribe request
 *
 * @param email
 * @return {Promise}
 * @private
 */
let unsubscribe_ = async (email) => {
    await Models.User.findOneAndUpdate({
        email: email
    },{
        emailSubscription: false
    })
};


/**
 * Change avatar
 *
 * @param id
 * @param file|null
 * @return {Promise}
 * @private
 */
let changeAvatar_ = async (id, file) => {
    let user = await Models.User.findById(id, {
        password: false
    });
    if (!user) return 'no-user';

    let newPath = 'no-user.png';
    let currentPath = path.join(avatarPath, user.avatar);

    if (file) {
        // Add new avatar
        let format = null;
        switch (file.mimetype) {
            case "image/png": format = "png"; break;
            case "image/jpeg": format = "jpeg"; break;
            case "image/jpg": format = "jpg"; break;
        }

        if (!format) return "invalid-format";

        let hash = crypto.createHmac('sha256', process.env.APP_SECRET).update(file.name + +new Date()).digest('hex');
        newPath = hash + "." + format;

        if (fs.existsSync(currentPath) && user.avatar !== 'no-user.png') {
            fs.unlinkSync(currentPath);
        }

        await file.mv(path.join(avatarPath, newPath));
    } else if (newPath !== user.avatar) {
        // Delete old avatar
        if (fs.existsSync(currentPath)) {
            fs.unlinkSync(currentPath);
        }
    }

    user.avatar = newPath;
    await user.save();

    return avatarURL + newPath;
};


module.exports = {
    getByEmail: getByEmail_,
    getById: getById_,
    update: update_,
    changePassword: changePassword_,
    deactivate: deactivate_,
    unsubscribe: unsubscribe_,
    changeAvatar: changeAvatar_
};