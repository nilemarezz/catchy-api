const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSheetsId } = require('../../../helpers/getSheetId')
const { client_email, private_key } = require('../../../config/cred')
const moment = require('moment-timezone')

exports.getOrders = async (req, res, next) => {
  try {
    const date = req.query.date
    const shop = req.query.shop
    console.log(moment().tz("Asia/Bangkok").toString(), ` - getOrders ${date},${shop}`)
    const sheetId = getSheetsId(shop)
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
      client_email: client_email,
      private_key: private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[date];
    const rows = await sheet.getRows();
    const data = []
    for (let i = 0; i < rows.length; i++) {
      data.push({
        "id": i,
        "order_id": rows[i]["order_id"] || null,
        "twitter": rows[i]["@Twitter"] || null,
        "product_name": rows[i]['รายการ'] || null,
        "amount": rows[i]['จำนวน'] || null,
        "product_status": rows[i]['สถานะสินค้า'] || null,
        "payment_status": rows[i]['สถานะการจ่ายเงิน'] || null,
        "image_link": rows[i]['image_link'] || null
      })
    }
    res.status(200).json({ success: true, data: data });
  } catch (err) {
    res.status(500).json({ success: false, code: err.response ? err.response.status : 405 });
  }
}

