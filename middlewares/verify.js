const bcrypt = require('bcrypt');

const verifyToken = async (req, res, next) => {
  try {
    const hashPassword = req.headers.authorization
    if (!hashPassword) {
      res.status(401).json({ success: false, code: 1001 });
    } else {
      const password = process.env.CATCHY_PASSWORD
      const result = await bcrypt.compare(password, hashPassword);
      if (result) {
        next();
      } else {
        res.status(401).json({ success: false, code: 1002 });
      }
    }
  } catch (err) {
    res.status(401).json({ success: false, error: 1003 });
  }

}

module.exports = verifyToken;