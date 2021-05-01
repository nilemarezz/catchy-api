const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSheetsId } = require('../../../helpers/getSheetId')
const { client_email, private_key } = require('../../../config/cred')
exports.patchOrderByOrderId = async (req, res, next) => {
  try {
    const { date, shop, id, address, slip_link, note } = req.body
    console.log(date, shop, id, address, slip_link, note)
    const sheetId = getSheetsId(shop)
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
      client_email: client_email,
      private_key: private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[date];
    const rows = await sheet.getRows();
    for (let i = 0; i < id.length; i++) {
      rows[id[i]]['ที่อยู่'] = address
      rows[id[i]]['slip_link'] = slip_link
      rows[id[i]]['Note'] = note
      await rows[id[i]].save();
    }
    console.log(req.body)
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, code: err.response ? err.response.status : 405 });
  }
}

