import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { user: req.user });
});

router.get("/print-sessions", (req, res) => {
  const sessionStore = req.sessionStore;
  sessionStore.all((err, sessions) => {
    if (err) {
      console.error("Error fetching sessions:", err);
      res.status(500).send("Failed to fetch sessions");
      return;
    }
    res.send(sessions);
  });
});

export default router;
