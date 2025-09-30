const axios = require("axios");
const qs = require("qs");

async function fetchYouTubeAllFormats(url) {
  try {
    const searchRes = await axios.post(
      "https://yt1s.ltd/api/ajaxSearch/index",
      qs.stringify({ q: url, vt: "home" }),
      { headers: getHeaders() }
    );

    const videoId = searchRes.data.vid;
    const k = searchRes.data.k;
    const title = searchRes.data.title;
    const thumbnail = searchRes.data.thumb;

    if (!videoId || !k) throw new Error("Video not found");

    const mp4Qualities = ["360", "480", "720", "1080"];
    const mp3Qualities = ["128"];
    const formats = [];

    const mp4Promises = mp4Qualities.map(async (q) => await getDlink(videoId, k, "mp4", q));
    const mp3Promises = mp3Qualities.map(async (q) => await getDlink(videoId, k, "mp3", q));

    const allResults = await Promise.all([...mp4Promises, ...mp3Promises]);
    allResults.forEach(f => f && formats.push(f));

    return { title, thumbnail, formats };
  } catch (err) {
    throw new Error(`YouTube service failed: ${err.message}`);
  }
}

async function fetchSingleDownload(url, ftype, fquality) {
  const searchRes = await axios.post(
    "https://yt1s.ltd/api/ajaxSearch/index",
    qs.stringify({ q: url, vt: "home" }),
    { headers: getHeaders() }
  );

  const videoId = searchRes.data.vid;
  const k = searchRes.data.k;

  const conv = await axios.post(
    "https://yt1s.ltd/api/ajaxConvert/convert",
    qs.stringify({ vid: videoId, k, ftype, fquality }),
    { headers: getHeaders() }
  );

  if (!conv.data.dlink) throw new Error("Download link not found");
  return conv.data.dlink;
}

function getHeaders() {
  return {
    accept: "*/*",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36",
    Referer: "https://yt1s.ltd/",
    "x-requested-with": "XMLHttpRequest",
  };
}

async function getDlink(videoId, k, ftype, fquality) {
  try {
    const conv = await axios.post(
      "https://yt1s.ltd/api/ajaxConvert/convert",
      qs.stringify({ vid: videoId, k, ftype, fquality }),
      { headers: getHeaders() }
    );
    if (conv.data.dlink) {
      return {
        type: ftype === "mp3" ? "audio" : "video",
        quality: ftype === "mp4" ? fquality + "p" : fquality + "kbps",
        extension: ftype,
        url: `/api/youtube/proxy?url=${encodeURIComponent(`https://youtu.be/${videoId}`)}&ftype=${ftype}&fquality=${fquality}`
      };
    }
  } catch {}
  return null;
}

module.exports = { fetchYouTubeAllFormats, fetchSingleDownload };
