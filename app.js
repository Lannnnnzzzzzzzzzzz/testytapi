const express = require("express");
const app = express();
const youtubeRoutes = require("./routes/youtube");

// Root route
app.get("/", (req, res) => {
  res.send({
    success: true,
    author: "ItsMeLannzz",
    contact: "Lann Zephry",
    msg: "gunakan dengan bijak.",
  });
});

// Youtube routes
app.use("/api/youtube", youtubeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
