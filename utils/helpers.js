
const format_date = date => {
  return `
  ${new Date(date)
    .getMonth() + 1}/${new Date(date)
    .getDate()}/${new Date(date)
    .getFullYear()
  }`;
};


const format_time = (date, format) => {
  var mmnt = moment(date);
  return mmnt.format(format);
};



const shrinkContent = content => {
  if (content.length > 50)
    return content.substring(0,50) + '...';
  return content;
}

module.exports = {
  format_date,
  format_time,
  shrinkContent
}
  
// Handlebars.registerHelper('dotdotdot', function(str) {
//   if (str.length > 10)
//     
//   return str;
// });
