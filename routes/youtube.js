const express = require("express");
const router = express.Router();
const { getYouTubeDownload, proxyDownload } = require("../controllers/youtubeController");

router.get("/download", getYouTubeDownload);
router.get("/proxy", proxyDownload);

module.exports = router;
