const express = require("express");
const ShortUrl = require("./modles/shortUrl");
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb://localhost/urlShortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 8080;

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrl", async (req, res) => {
  console.log(req.body.fullUrl);
  await ShortUrl.create({
    full: req.body.fullUrl,
  });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) {
    return res.sendStatus(404);
  }

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
