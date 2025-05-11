const Url = require('../models/Url');
const generateShortId = require('../utils/generateShortId');
const db = require('../config/db');


exports.createShortUrl = (req, res) => {
    const uniqueID = generateShortId();
    Url.create(req.body.longurl, uniqueID, (error, result) => {
        if (error) {
            console.error("Error creating URL:", error);
            res.status(500).json({ status: "notok", message: "Something went wrong" });
        } else {
            res.status(200).json({ status: "ok", shorturlid: uniqueID });
        }
    });
};


exports.getAllUrls = (req, res) => {
    Url.findAll((error, results) => {
        if (error) {
            console.error("Error fetching URLs:", error);
            res.status(500).json({ status: "notok", message: "Something went wrong" });
        } else {
            res.status(200).json(results);
        }
    });
};


exports.redirectUrl = (req, res) => {
    const shorturlid = req.params.shorturlid;
    Url.findByShortId(shorturlid, (error, results) => {
        if (error || results.length === 0) {
            res.status(404).json({ status: "notok", message: "Short URL not found" });
        } else {
            const newCount = results[0].count + 1;
            Url.incrementCount(results[0].id, newCount, (updateError) => {
                if (updateError) {
                    res.status(500).json({ status: "notok", message: "Something went wrong updating count" });
                } else {
                    res.redirect(results[0].longurl);
                }
            });
        }
    });
};


exports.clearAllUrls = (req, res) => {
    const sql = "TRUNCATE TABLE links"; 
    db.query(sql, (error, result) => {
        if (error) {
            console.error("Error clearing URLs:", error);
            res.status(500).json({ 
                status: "notok", 
                message: "Failed to clear URLs",
                error: error.message 
            });
        } else {
            res.status(200).json({ 
                status: "ok", 
                message: "All URLs cleared",
                affectedRows: result.affectedRows 
            });
        }
    });
};



exports.clearAllUrls = (req, res) => {
    const sql = "DELETE FROM links"; // Using DELETE instead of TRUNCATE for better error handling
    db.query(sql, (error, result) => {
        if (error) {
            console.error("Error clearing URLs:", error);
            res.status(500).json({ 
                status: "notok", 
                message: "Failed to clear URLs",
                error: error.message 
            });
        } else {
            res.status(200).json({ 
                status: "ok", 
                message: "All URLs cleared successfully",
                affectedRows: result.affectedRows 
            });
        }
    });
};


exports.deleteUrl = (req, res) => {
    const shorturlid = req.params.shorturlid;
    
    if (!shorturlid) {
        return res.status(400).json({
            status: "notok",
            message: "Short URL ID is required"
        });
    }

    const sql = "DELETE FROM links WHERE shorturlid = ?";
    db.query(sql, [shorturlid], (error, result) => {
        if (error) {
            console.error("Error deleting URL:", error);
            return res.status(500).json({ 
                status: "notok", 
                message: "Failed to delete URL",
                error: error.message 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                status: "notok", 
                message: "URL not found" 
            });
        }

        return res.status(200).json({ 
            status: "ok", 
            message: "URL deleted successfully",
            affectedRows: result.affectedRows 
        });
    });
};
