const { fetchYouTubeAllFormats, fetchSingleDownload } = require("../services/youtubeService");

async function getYouTubeDownload(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url param" });

  try {
    const data = await fetchYouTubeAllFormats(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function proxyDownload(req, res) {
  const { url, ftype = "mp4", fquality = "720" } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url param" });

  try {
    const downloadUrl = await fetchSingleDownload(url, ftype, fquality);
    const response = await require("axios").get(downloadUrl, { responseType: "stream" });
    res.setHeader("Content-Disposition", `attachment; filename=video.${ftype}`);
    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getYouTubeDownload, proxyDownload };
