'use strict';

const express   = require('express');
const router    = express.Router();
const cParks    = require('../../controllers/parks');

const COURSES_FILE_PATH = require('path').join(__dirname, "..", "..", "_source", "courses.json");

/**
 * Get all parks with minimal price
 *
 * @example GET /parks
 */
router.get('/', async (req, res) => {
    try {
        let parks = await cParks.getAll();

        if (!parks)
            return res.status(404).json( { error: "Parks do not found." } );

        res.json({
            message: "Parks were received successfully.",
            data: parks,
            courseJSON: require(COURSES_FILE_PATH)
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Get full park description with tickets
 *
 * @example GET /parks/:link
 */
router.get('/:link', async (req, res) => {
    try {
        let park = await cParks.getOneByLink(req.params.link);

        if (!park)
            return res.status(404).json( { error: "Park does not found." } );

        res.json({
            message: "Park was received successfully.",
            data: park
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


module.exports = router;