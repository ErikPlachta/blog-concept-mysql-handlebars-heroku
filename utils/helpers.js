var moment = require('moment'); //-- Using to add more dynamic date-time in view

const format_date = date => {
  return `
  ${new Date(date)
    .getMonth() + 1}/${new Date(date)
    .getDate()}/${new Date(date)
    .getFullYear()
  }`;
};


const get_TimePassed = ( date ) => {
  //-- Get current time
  var now = moment(new Date()); 
  //-- Get the diff between now and created date
  var duration = moment.duration(now.diff(date));
  //-- Return value in hours
  var results = duration.asHours();

  if(results < 0.01){ let seconds = ((duration._data.seconds)) + " s"; return seconds; }
  if(results < 1){ let minutes = ((duration._data.minutes)) + " m"; return minutes; }
  if(results < 24){ let hours = (Math.trunc(results)) + " h"; return hours; }
  if(results >= 24){ let days = Math.trunc(results / 24) + " d"; return days; }
  
  //-- If for some reason gets to this point, return nothing. ( shouldn't happen but being safe )
  return null;
};


const shrinkContent = content => {
  if (content.length > 250)
    return content.substring(0,250) + '...';
  return content;
}

module.exports = {
  format_date,
  get_TimePassed,
  shrinkContent
}
  
// Handlebars.registerHelper('dotdotdot', function(str) {
//   if (str.length > 10)
//     
//   return str;
// });
