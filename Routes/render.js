const express = require("express");

const router = express();

// test route
router.get("/user", (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).send({ sucess: true, data: req.session.user });
  } else {
    res.status(401).send({ sucess: false, msg: "auth required!" });
  }
});

router.get("/", (req, res) => {
  res.status(200).render("pages/home", { user: req.session.user });
});

router.get("/login", (req, res) => {
  res.status(200).render("pages/login");
});

router.get("/register", (req, res) => {
  res.status(200).render("pages/register");
});

exports.default = router;
