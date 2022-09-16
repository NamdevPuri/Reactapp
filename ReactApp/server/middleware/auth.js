const jwt = require("jsonwebtoken");
const users = require("../models/userSchema.js");

const auth = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    if (!token)
      return res.status(403).send({ status: false, msg: "Token is required" });

    let splitToken = token.split(" ")[1];

    jwt.verify(
      splitToken,
      process.env.JWT_SECRET_KEY,
      { ignoreExpiration: true },
      function (err, decoded) {
        if (err) {
          return res
            .status(400)
            .send({ status: false, meessage: "token invalid" });
        } else {
          if (Date.now() > decoded.exp * 1000) {
            return res
              .status(401)
              .send({ status: false, msg: "Session Expired" });
          }

          req.userId = decoded.userId;
          next();
        }
      }
    );
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
};

module.exports.auth = auth;
