exports.postOrder = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, method: 'post orders ' });
  } catch (err) {
    res.status(500).json({ success: false, method: 'post orders  ' });
  }
}
