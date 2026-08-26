const crypto = require("crypto");

const userIdGen = () => {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `INVPRO-${random}`;
};

module.exports = userIdGen;