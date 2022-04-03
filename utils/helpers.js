var moment = require('moment'); //-- Using to add more dynamic date-time in view

//-- Formatting Date from moment to MM/DD/YYYY 
const format_date = date => {
  return `${
    new Date(date).getMonth() + 1}
    /${new Date(date).getDate()}
    /${new Date(date ).getFullYear()
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
  if (content.length > 100)
    return content.substring(0,100) + '...';
  return content;
}

// comparison operators
const eq = (var1, var2) =>  { console.log(var1,var2);return var1 === var2 };
const ne = (var1, var2) =>  { return var1 !== var2 };
const lt = (var1, var2) =>  { return var1 <   var2 };
const gt = (var1, var2) =>  { return var1 >   var2 };
const lte = (var1, var2) => { return var1 <=  var2 };
const gte = (var1, var2) => { return var1 >=  var2 };

module.exports = {
  format_date,
  get_TimePassed,
  shrinkContent,
  eq, ne, lt, gt, lte, gte
}
  
// Handlebars.registerHelper('dotdotdot', function(str) {
//   if (str.length > 10)
//     
//   return str;
// });
