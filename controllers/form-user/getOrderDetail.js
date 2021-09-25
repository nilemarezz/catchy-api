const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSheetsId } = require('../../helpers/getSheetId')
const { client_email, private_key } = require('../../config/cred')
const moment = require('moment-timezone')

exports.getOrderByOrderId = async (req, res, next) => {
  try {
    const date = req.query.date
    const shop = "catchy_kr"
    const order_id = req.params.order_id
    console.log(moment().tz("Asia/Bangkok").toString(), ` - getOrderByOrderId(user) ${date},${shop},${order_id}`)
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
      // total2 = ยอดค้างชำระ
      data.push({
       
        "id": i,
        "order_id": rows[i]["order_id"] || null,
        "twitter": rows[i]["@Twitter"] || null,
        "product_name": rows[i]['รายการ'] || null,
        "amount": rows[i]['จำนวน'] || null,
        "payment_method": rows[i]['สถานะการจ่ายเงิน'] || null,
        "shipping_method": rows[i]['การจัดส่ง'] || null,
        "product_pay": rows[i]['ยอดที่โอน'] || null,
        "product_price": rows[i]['ราคาขาย'] || null,
        "shipping_price": rows[i]['ค่าส่งที่เก็บ'] || null,
        "total2": rows[i]['ยอดมัดจำที่เหลือ'] || null,
        "slip_link": rows[i]['slip_link'] || '',
        "address" : rows[i]['ที่อยู่'] || '',
        "date": date,
        "shop": shop
      })
    }
    const filter = data.filter(item => item.order_id === order_id)
    res.status(200).json({ success: true, data: filter });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, code: err.response ? err.response.status : 405 });
  }
}

