const express = require("express");

const router = express.Router();

router.get("", (req, res) => {
  console.log(req.body);
  res.status(200).json({
    success: true,
    message: "Welcome to my server",
  });
});

module.exports = router;
