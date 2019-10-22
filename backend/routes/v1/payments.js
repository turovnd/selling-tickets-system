'use strict';

const express   = require('express');
const router    = express.Router();
const cPayments = require('../../controllers/payments');


/**
 * Handle payment request.
 *
 * @example POST /payments
 */
router.post('/', async (req, res) => {
    try {
        req.body.ipAddress = req.ip;

        let result = await cPayments.makePayment(req.body);

        if (typeof result === 'string') {
            switch (result) {
                case 'no-order':
                    return res.status(404).json( { error: "Order does not found." } );
                case 'already-paid':
                    return res.status(400).json( { error: "Order has already been paid." } );
                case 'no-ticket':
                    return res.status(404).json( { error: "Ticket does not found." } );
                case 'payment-creation':
                    return res.status(500).json( { error: "The request for payment canceled. Try again later." } );
            }
        }

        res.json({
            message: "Payment was processed successfully.",
            data: result
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Handle callback for payment request
 *      - 3D secure
 *
 * @param ID => order ID
 * @example POST /payments/callback/:id
 */
router.post('/callback/:id', async (req, res) => {
    try {
        let resultLink = await cPayments.confirm3DPayment(req.params.id, req.body);

        res.redirect(resultLink);
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Handle confirm payment request
 *
 * @example POST /payments/confirm
 */
router.post('/confirm', async (req, res) => {
    try {
        res.json({
            code: await cPayments.confirmPayment(req.body)
        });
    } catch (error) {
        res.json({ code: 500 })
    }
});


module.exports = router;