const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSheetsId } = require('../../../helpers/getSheetId')
const { client_email, private_key } = require('../../../config/cred')
const moment = require('moment-timezone')

exports.getOrderById = async (req, res, next) => {
  try {
    const date = req.query.date
    const shop = req.query.shop
    console.log(moment().tz("Asia/Bangkok").toString(), ` - getOrderById ${date},${shop},row:${parseInt(req.params.id) + 1}`)
    const sheetId = getSheetsId(shop)
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth({
      client_email: client_email,
      private_key: private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[date];
    const rows = await sheet.getRows();
    const index = parseInt(req.params.id) + 1
    const data = {
      "id": index,
      "order_id": rows[index]["order_id"] || null,
      "twitter": rows[index]["@Twitter"] || null,
      "product_name": rows[index]['รายการ'] || null,
      "amount": rows[index]['จำนวน'] || null,
      "product_status": rows[index]['สถานะสินค้า'] || null,
      "payment_status": rows[index]['สถานะการจ่ายเงิน'] || null,
      "image_link": rows[index]['image_link'] || null,
      "tracking_no": rows[index]['Tracking no.'] || null,
      "shipping_method": rows[index]['การจัดส่ง'] || null,
      "address": rows[index]['ที่อยู่'] || null,
      "pay_amount": rows[index]['ยอดที่โอน'] || null,
      "note": rows[index]['Note'] || null,
      "cost": rows[index]['ต้นทุน'] || null,
      "price": rows[index]['ราคาขาย'] || null,
      "shipping_price": rows[index]['ค่าส่งที่เก็บ'] || null,
      "shipping_price_real": rows[index]['ค่าส่งจริง'] || null,
      "shop": shop
    }

    await res.status(200).json({ success: true, data: data });
  } catch (err) {
    // console.log('errer in'err)
    res.status(500).json({ success: false, code: err.response ? err.response.status : 405 });
  }
}
