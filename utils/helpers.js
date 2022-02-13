var moment = require('moment'); //-- Using to add more dynamic date-time in view

const format_date = date => {
  return `
  ${new Date(date)
    .getMonth() + 1}/${new Date(date)
    .getDate()}/${new Date(date)
    .getFullYear()
  }`;
};


const hours_passed = ( date ) => {
  
  //-- Get curent time
  var now = moment(new Date()); 
  //-- Get the diff between now and created date
  var duration = moment.duration(now.diff(date));
  //-- Return value in hours
  var results = duration.asHours();
  
  if(results < 1){
    minutes = (Math.trunc(results)) + " minutes ago";
    return minutes;
  }
  
  if(results < 24){
    hours = (Math.trunc(results)) + " hours ago";
    return hours;
  }

  if(results > 24){
    days = Math.trunc(results / 24) + " d";
    return days;
  }
  

  
};



const shrinkContent = content => {
  if (content.length > 50)
    return content.substring(0,50) + '...';
  return content;
}

module.exports = {
  format_date,
  hours_passed,
  shrinkContent
}
  
// Handlebars.registerHelper('dotdotdot', function(str) {
//   if (str.length > 10)
//     
//   return str;
// });
