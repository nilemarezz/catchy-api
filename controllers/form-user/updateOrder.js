const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSheetsId } = require('../../helpers/getSheetId')
const { client_email, private_key } = require('../../config/cred')
const moment = require('moment-timezone')
exports.patchOrderByOrderId = async (req, res, next) => {
  try {
    const data = req.body
    const date = data.date
    const product = data.product
    const shop = "catchy_kr"
    console.log(moment().tz("Asia/Bangkok").toString(), ` - patchOrderByOrderId(user) ${date},${shop}`)
    const sheetId = getSheetsId(shop)
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
      client_email: client_email,
      private_key: private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[date];
    const rows = await sheet.getRows();
    for (let i = 0; i < product.length; i++) {
      let id = product[i].id
      rows[id]['@Twitter'] = data.account
      rows[id]['ที่อยู่'] = data.address
      rows[id]['slip_link'] = data.slip_link
      rows[id]['Note'] = data.note
      rows[id]['ชื่อ'] = data.name
      rows[id]['ที่อยู่'] = data.address
      rows[id]['เบอร์โทรศัพท์'] = data.tel
      await rows[id].save();
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, code: err.response ? err.response.status : 405 });
  }
}

