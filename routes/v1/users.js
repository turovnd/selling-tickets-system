'use strict';

const express   = require('express');
const router    = express.Router();

const passport  = require('../../services/passport');
const cUsers    = require('../../controllers/users');

/**
 * Check if user exist
 *
 * @example GET /users/check?email=
 */
router.get('/check', async (req, res) => {
    try {
        let email = req.query.email;
        if (!email)
            return res.status(404).json({ error: "User does not exist" });

        let user = await cUsers.getByEmail(email);

        if (!user)
            return res.status(404).json({ error: "User does not exist" });

        res.json({ message: 'User exists' })
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


/**
 * Get my account information
 *
 * @requires JWT
 * @example GET /users/me
 */
router.get('/me', passport().authenticateJWT(), async (req, res) => {
    try {
        let user = await cUsers.getById(req.user.id);
        if (!user)
            return res.status(404).json({ error: "User is deactivated" });

        res.json({
            message: 'Profile data was retrieved successfully.',
            data: user
        })
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


/**
 * Update my account information
 *
 * @requires JWT
 * @example PUT /users/me
 */
router.put('/me', passport().authenticateJWT(), async (req, res) => {
    try {
        let user = await cUsers.update(req.user.id, req.body);

        if (typeof user === "string") {
            switch (user) {
                case "not-found":
                    return res.status(404).json({ error: "User is deactivated" });
                case "duplicate-email":
                    return res.status(404).json({ error: "Email already in use" });
            }
        }

        res.json({
            message: 'Profile data was updated successfully.',
            data: user
        })
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


/**
 * Change password
 *
 * @requires JWT
 * @example PUT /users/me/password
 */
router.put('/me/password', passport().authenticateJWT(), async (req, res) => {
    try {
        let user = await cUsers.changePassword(req.user.id, req.body);

        if (typeof user === "string") {
            switch (user) {
                case "same-passwords":
                    return res.status(404).json({ error: "Current and new passwords cannot be same" });
                case "old-password-incorrect":
                    return res.status(404).json({ error: "Current password is not correct" });
            }
        }

        res.json({
            message: 'Password was changed successfully.'
        })
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


/**
 * Deactivate password
 *
 * @requires JWT
 * @example POST /users/me/deactivate
 */
router.post('/me/deactivate', passport().authenticateJWT(), async (req, res) => {
    try {
        let user = await cUsers.deactivate(req.user.id);

        if (!user)
            return res.status(404).json({ error: "User is deactivated" });

        res.json({
            message: 'User was deactivated successfully.'
        })
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


/**
 * Change avatar
 *
 * @requires JWT
 * @example POST /users/me/avatar
 */
router.post('/me/avatar', passport().authenticateJWT(), async (req, res) => {
    try {
        let newPath = await cUsers.changeAvatar(req.user.id, req.files.avatar);

        if (typeof newPath === "string") {
            switch (newPath) {
                case "no-user":
                    return res.status(404).json({ error: "User is deactivated." });
                case "invalid-format":
                    return res.status(400).json({ error: "Invalid file format." });
            }
        }

        res.json({
            message: 'Avatar was successfully changed successfully.',
            data: newPath
        })
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


/**
 * Delete avatar
 *
 * @requires JWT
 * @example DELETE /users/me/avatar
 */
router.delete('/me/avatar', passport().authenticateJWT(), async (req, res) => {
    try {
        let newPath = await cUsers.changeAvatar(req.user.id, null);

        if (typeof newPath === "string") {
            switch (newPath) {
                case "no-user":
                    return res.status(404).json({ error: "User is deactivated." });
                case "invalid-format":
                    return res.status(400).json({ error: "Invalid file format." });
            }
        }

        res.json({
            message: 'Avatar was successfully changed successfully.',
            data: newPath
        })
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;