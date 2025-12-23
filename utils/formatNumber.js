function formatNumber(num) {
  let formattedNum = num;

  if (num >= 1000000000) {
    formattedNum = '9.9亿';
  } else if (num >= 100000000) {
    // 大于等于1亿显示为"xxx亿"
    formattedNum = (num / 100000000).toFixed(1) + '亿';
  } else if (num >= 10000) {
    // 大于等于1万小于1亿显示为"xxx万"
    formattedNum = (num / 10000).toFixed(1) + '万';
  } else {
    // 小于1万直接显示
    formattedNum = num.toString();
  }

  return formattedNum;
}

module.exports = {
  formatNumber
};