exports.getSheetUserId = (shop) => {
  if (shop === 'catchy_jp') {
    return process.env.CATCHY_SHEET_USER_JP
  } else if (shop === "catchy_kr") {
    return process.env.CATCHY_SHEET_USER_KR
  }
}