const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getSheetsId } = require('../../helpers/getSheetId')
const { client_email, private_key } = require('../../config/cred')
const moment = require('moment-timezone')


exports.getItems = async (req, res) => {
  const twitter = req.params.twitter
  const tel = req.params.tel
  const year = moment().year();
  const promises = []
  let thisMonth = moment().month() + 1;
  let beforeMonth = moment().subtract(4, 'months').month() + 1
  for (let i = thisMonth; i > beforeMonth; i--) {
    promises.push(getDataPromise(`${i}_${year}`, twitter, tel));
  }
  let data = [];
  await Promise.all(promises).then((result) => {
    result.map(item => {
      if (item === false) {
        data = [...data, false]
      } else {
        if (item.data.length !== 0) {
          data.push(item)
        }
      }
    })
  })
  if (data.includes(false)) {
    res.json({ success: false, msg: "Max times call api , Please try again in few minutes" });
  } else {
    res.json({ success: true, items: data });
  }
}

const getDataPromise = async (date, account, tel) => {
  return new Promise(async (resolve) => {
    try {
      const doc = new GoogleSpreadsheet(getSheetsId("catchy_kr"));
      await doc.useServiceAccountAuth({
        client_email: client_email,
        private_key: private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
      });
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle[date];
      const rows = await sheet.getRows();
      const data = []
      for (let i = 0; i < rows.length; i++) {
        if (rows[i]["@Twitter"].toLowerCase() === account.toLowerCase()) {
          console.log(rows[i]["เบอร์โทรศัพท์"], '..')
          console.log(typeof rows[i]["เบอร์โทรศัพท์"], '...')
          if (rows[i]["เบอร์โทรศัพท์"] !== undefined && rows[i]["เบอร์โทรศัพท์"] !== null) {
            let telno = String(rows[i]["เบอร์โทรศัพท์"])
            if (telno.replace(/-/g, "") === tel) {
              data.push({
                "id": i,
                "order_id": rows[i]["order_id"] || null,
                "twitter": rows[i]["@Twitter"] || null,
                "product_name": rows[i]['รายการ'] || null,
                "amount": rows[i]['จำนวน'] || null,
                "payment_status": rows[i]['สถานะการจ่ายเงิน'] || null,
                "payment_method": rows[i]['การจัดส่ง'] || null,
                "product_status": rows[i]['สถานะสินค้า'] || null,
                "tracking_no": rows[i]['Tracking no.'] || null,
                "date": date,
                "success": true,
              })
            }
          }
        }
      }
      resolve({ date: date, data: data })
    } catch (err) {
      console.log(err)
      resolve(false)
    }
  })
}