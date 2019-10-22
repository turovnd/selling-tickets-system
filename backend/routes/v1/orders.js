'use strict';

const express   = require('express');
const router    = express.Router();
const cOrders   = require('../../controllers/orders');
const cPayments = require('../../controllers/payments');
const passport  = require('../../services/passport');


/**
 * Create order request
 *
 * @example POST /orders
 */
router.post('/', async (req, res) => {
    try {
        // Handle errors
        if (!req.body.ticketId)
            return res.status(400).json( { error: "Missed ticket ID." } );

        if (!req.body.visitDate)
            return res.status(400).json( { error: "Visit date has not specified." } );

        let order = "invalid-order";
        if (req.body.orderId)
            order = await cOrders.updateOrder(req.body.orderId, req.body);

        if (!order._id || !req.body.orderId)
            order = await cOrders.createOrder(req.body);

        if (typeof order === "string") {
            switch (order) {
                case "invalid-ticket":
                  return res.status(400).json( { error: "Invalid ticket. It does not found." } );
                case "invalid-park":
                  return res.status(400).json( { error: "Invalid park. It does not found." } );
                case "invalid-order":
                  return res.status(500).json( { error: "Something goes wrong. Try again later." } );
            }
        }

        let result = await cPayments.makePayment({
            orderId: order._id,
            requestFrom: req.headers.referer,
            ipAddress: req.ip,
            cardHolder: req.body.paymentDetails.paymentCardHolder,
            packet: req.body.paymentDetails.paymentPacket
        });

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
            message: "Order was created successfully.",
            data: {
                orderId: order._id,
                transaction: result
            }
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Get my orders
 *
 * @requires JWT
 * @example GET /orders/:id
 */
router.get('/my', passport().authenticateJWT(), async (req, res) => {
    try {
        res.json({
            message: "Orders were received successfully.",
            data: await cOrders.getMyOrders(req.user.id)
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Get orders statistics
 *
 * @requires JWT
 * @example GET /orders/statistics
 */
router.get('/statistics', passport().authenticateJWT(), async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(403).json({ error: 'Access deny' });

        return res.json({
            message: "Orders statistics was received successfully.",
            data: await cOrders.getStatistics()
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Get order details by secret
 *
 * @example POST /orders/details
 */
router.post('/details', async (req, res) => {
    try {
        let details = await cOrders.getOrder(req.body.id, req.body.secret);

        if (details === "not-found")
            return res.status(404).json( { error: "Order does not found." } );
        else if (details === "incorrect-secret")
            return res.status(400).json( { error: "Incorrect leader traveler first and last names." } );

        res.json({
            message: "Order was received successfully.",
            data: details
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Get order by ID
 *
 * @requires JWT
 * @example GET /orders/:id
 */
router.get('/:id', passport().authenticateJWT(), async (req, res) => {
    try {
        let details = await cOrders.getOrder(req.params.id);

        if (details === "not-found")
            return res.status(404).json( { error: "Order does not found." } );

        res.json({
            message: "Order was received successfully.",
            data: details
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Get order ticket
 *
 * @example GET /orders/:id/ticket?secret
 * @example GET /orders/:id/ticket/:path?secret
 */
router.get('/:id/ticket/:path', async (req, res) => {
    try {
        let ticket = await cOrders.getOrderTicket(req.params.id, req.params.path, req.query.secret || 'empty');

        if (!ticket)
            return res.redirect(process.env.HOMEPAGE + '/not-found');

        res.download(ticket.path, ticket.name);
    } catch (error) {
        return res.redirect(process.env.HOMEPAGE + '/not-found');
    }
});


/**
 * Get all orders
 *
 * @requires JWT
 * @example GET /orders?query
 */
router.get('/', passport().authenticateJWT(), async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(403).json({ error: 'Access deny' });

        return res.json({
            message: "Orders statistics was received successfully.",
            data: await cOrders.getAllOrders(req.query)
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Update order by ID
 *
 * @requires JWT
 * @example PUT /orders/:id
 */
router.put('/:id', passport().authenticateJWT(), async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(403).json({ error: 'Access deny' });

        let order = await cOrders.updateOrder(req.params.id, req.body);

        if (!order)
            return res.status(404).json( { error: "Order does not found." } );

        res.json({
            message: "Order was updated successfully.",
            data: order
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Cancel order by ID
 *
 * @requires JWT
 * @example PUT /orders/:id/cancel
 */
router.put('/:id/cancel', passport().authenticateJWT(), async (req, res) => {
    try {
        if (!(req.user.isAdmin || await cOrders.checkOrderUser(req.params.id, req.user.id)))
            return res.status(403).json({ error: 'Access deny' });

        let order = await cOrders.cancelOrder(req.params.id);

        if (order === "not-found")
            return res.status(404).json( { error: "Order does not found." } );
        else if (order === "order-charged")
            return res.status(400).json( { error: "Order was charged." } );
        else if (order === "order-refunded")
            return res.status(400).json( { error: "Order was refunded." } );
        else if (order === "order-canceled")
            return res.status(400).json( { error: "Order was canceled." } );
        else if (order === "payment-error")
            return res.status(400).json( { error: "An error occurred while cancelling the payment. " +
              "Contact with the administrator of the site to cancel the order." } );

        res.json({
            message: "Order was canceled successfully."
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Charge order by ID
 *
 * @requires JWT
 * @example PUT /orders/:id/charge
 */
router.put('/:id/charge', passport().authenticateJWT(), async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(403).json({ error: 'Access deny' });

        let order = await cOrders.chargeOrder(req.params.id);

        if (order === "not-found")
            return res.status(404).json( { error: "Order does not found." } );
        else if (order === "order-refunded")
            return res.status(400).json( { error: "Order was refunded." } );
        else if (order === "order-canceled")
            return res.status(400).json( { error: "Order was canceled." } );
        else if (order === "payment-error")
            return res.status(400).json( { error: "An error occurred while confirming the payment. " +
              "For more details visit account of the payment provider." } );

        res.json({
            message: "Order was charged successfully."
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Refund order by ID
 *
 * @requires JWT
 * @example PUT /orders/:id/refund
 */
router.put('/:id/refund', passport().authenticateJWT(), async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(403).json({ error: 'Access deny' });

        let order = await cOrders.refundOrder(req.params.id);

        if (order === "not-found")
            return res.status(404).json( { error: "Order does not found." } );
        else if (order === "order-canceled")
            return res.status(400).json( { error: "Order was canceled." } );
        else if (order === "payment-error")
            return res.status(400).json( { error: "An error occurred while rebounding the payment. " +
              "For more details visit account of the payment provider." } );

        res.json({
            message: "Order was refunded successfully."
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Add file to the order
 *
 * @requires JWT
 * @example POST /orders/:id/files
 */
router.post('/:id/files', passport().authenticateJWT(), async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(403).json({ error: 'Access deny' });

        if (!req.files.file)
            return res.status(400).json({ error: 'Missed file in the body' });

        let data = await cOrders.addFile(req.params.id, req.files.file);

        if (typeof data === "string") {
            switch (data) {
                case "no-order": return res.status(404).json( { error: "Order does not found." } );
                case "invalid-format": return res.status(404).json( { error: "Invalid file format." } );
            }
        }

        res.json({
            message: "Files was uploaded successfully.",
            data: data
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Delete file from the order
 *
 * @requires JWT
 * @example DELETE /orders/:id/files/:file
 */
router.delete('/:id/files/:file', passport().authenticateJWT(), async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(403).json({ error: 'Access deny' });

        if (!req.params.file)
            return res.status(400).json({ error: 'Missed file path in the body' });

        let data = await cOrders.deleteFile(req.params.id, req.params.file);

        if (!data)
            return res.status(404).json( { error: "Order does not found." } );

        res.json({
            message: "Files was deleted successfully."
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Send tickets request
 *
 * @requires JWT
 * @example PUT /orders/:id/send
 */
router.put('/:id/send', passport().authenticateJWT(), async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(403).json({ error: 'Access deny' });

        let hasSend = await cOrders.sendTickets(req.params.id, req.body);

        switch (hasSend) {
            case 'no-order': return res.status(404).json( { error: "Order does not found." } );
            case 'unsupported-method': return res.status(400).json({ error: 'Method does not support' });
        }

        res.json({
            message: "Tickets were sent successfully."
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


module.exports = router;