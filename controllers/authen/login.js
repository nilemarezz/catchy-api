const bcrypt = require('bcrypt');

exports.postLogin = async (req, res, next) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    if (username === process.env.CATCHY_USERNAME && password === process.env.CATCHY_PASSWORD) {
      const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));
      res.status(200).json({ success: true, token: hash });
    } else {
      res.status(500).json({ success: false, code: 1002 });
    }
  } catch (err) {
    res.status(500).json({ success: false, code: 1003 });
  }
}