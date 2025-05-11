const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const path = require('path');

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

router.post("/api/create-short-url", urlController.createShortUrl);
router.get("/api/get-all-short-urls", urlController.getAllUrls);
router.get("/:shorturlid", urlController.redirectUrl);
router.delete("/api/clear-all-urls", urlController.clearAllUrls);
router.delete("/api/delete-url/:shorturlid", urlController.deleteUrl);


module.exports = router;

