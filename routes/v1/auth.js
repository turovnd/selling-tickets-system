'use strict';

const express       = require('express');
const router        = express.Router();
const cAuth         = require('../../controllers/authentication');
const cUsers        = require('../../controllers/users');


/**
 * Change user flags on unsubscribe request.
 *
 * @example GET /auth/unsubscribe
 */
router.get('/unsubscribe', async (req, res) => {
    try {
        let email = req.query.md_email;
        await cUsers.unsubscribe(email);
        res.redirect(process.env.HOMEPAGE);
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Handle register request
 *
 * @example POST /auth/register
 */
router.post('/register', async (req, res) => {
    try {
        let userData = await cAuth.register(req.body);

        if (userData.error)
            return res.status(400).json( { error: "User with such email exists" } );

        res.json({
            message: "Successfully signed up.",
            data: userData.tokens
        });

    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});



/**
 * Generate access and refresh tokens by code
 *
 *
 * @example POST /auth/login
 */
router.post('/login', async (req, res) => {
    try {
        let userData = await cAuth.login(req.body);

        if (userData.error)
            return res.status(400).json( { error: "User with such email and password does not exist." } );

        return res.json({
            message: "Successfully signed in",
            data: userData.tokens
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});



/**
 * Remove refresh token from DB
 *
 *
 * @example POST /auth/logout
 */
router.post('/logout', async (req, res) => {
    try {
        await cAuth.logout(req.query);

        return res.json({
            message: "Successfully logged out"
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});



/**
 * Renew access and refresh tokens.
 *
 * @example POST /auth/refresh
 */
router.post('/refresh', async (req, res) => {
    let refreshToken = req.query.refresh || req.body.refresh;
    try {
        let tokens = await cAuth.refreshTokens(refreshToken);

        if (tokens === "expired")
            return res.status(400).json({ error: "Refresh token is expired." });
        else if (tokens === "error")
            return res.status(400).json({ error: "Invalid refresh token." });

        res.json(tokens);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


/**
 * Confirm email router
 *
 * @example GET /auth/confirm
 */
router.get('/confirm', async (req, res) => {
    try {
        let userData = await cAuth.confirmEmail(req.query.hash);

        if (userData.error)
            return res.status(400).redirect(process.env.HOMEPAGE + "?error=invalid-confirm-hash");

        res.json({
            message: "Successfully confirm email",
            data: userData.tokens
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Reset password router
 *
 * @example POST /auth/reset
 */
router.post('/reset', async (req, res) => {
    try {
        let userData = await cAuth.resetPassword(req.body);

        if (!userData)
            return res.status(400).json( { error: "User with such email does not exist." } );

        res.json({
            message: "Successfully reset password. The link has been sent to the email."
        })

    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Recovery password router
 *
 * @example POST /auth/recovery
 */
router.post('/recovery', async (req, res) => {
    try {
        let userData = await cAuth.recoveryAccess(req.body);

        if (!userData)
            return res.status(400).json( { error: "Invalid link. Please retry recovery password again." } );

        res.json({
            message: "Successfully recovery access",
            data: userData.tokens
        })
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


module.exports = router;