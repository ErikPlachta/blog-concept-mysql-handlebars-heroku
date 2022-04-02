//-- LOGIN FORM
const loginFormHandler = async (event) => {
  
  event.preventDefault(); //-- prevent default submission behavior

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();
  //-- if user provided a username and password inform, attempt to login
  if (email && password) {
    const response = await fetch('api/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
    });

    //-- Login success. Routing to homepage.
    if (response.ok)  {      
      document.location.replace('/profile')
    }  
    //-- If was unable to login, console error // TODO:: 02/26/2022 #EP || Add UI update
    if (!(response.ok)){ console.log('//-- Failed to log in. check with admin.'); }
  }
};
//-- Add listener for login submission
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);



//-- SIGN-UP FORM
const signupFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector("#name-signup").value.trim();
  const username = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  //-- if ALL var provided when submit event happens, attempt to create new user.
  if (name && username && email && password) {
    const response = await fetch('api/users/signup', {
            method: 'POST',
            body: JSON.stringify({ name, username, email, password }),
            headers: { 'Content-Type': 'application/json' },
    });
    //-- Created user success. Routing to homepage.
    if (response.ok) {
      
      document.location.replace('/profile')
    ;}
    //-- If was unable to login, console error // TODO:: 02/26/2022 #EP || Add UI update
    if (!response.ok){ console.log('//-- Failed to sign up. Check with admin.');}
  }
};

//-- add listen for submit
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);




const _canSignup = event => {

  //-- get values at time of key press is released to verify validity of value
  const nameSignup = (document.querySelector('#name-signup').checkValidity());
  const usernameSignup = (document.querySelector('#username-signup').checkValidity());
  const emailSignup = (document.querySelector('#email-signup').checkValidity());
  const passwordSignup = (document.querySelector('#password-signup').checkValidity());
  
  //-- if not valid name, can't login, exit
  if(!nameSignup){
    document.querySelector('#btn-user-signup').disabled=true;  
    return null;
  };

  //-- if not valid username, can't login, exit
  if(!usernameSignup){
    document.querySelector('#btn-user-signup').disabled=true;  
    return null;
  };

   //-- if not valid email, can't login, exit
   if(!emailSignup){
    document.querySelector('#btn-user-signup').disabled=true;  
    return null;
  };

  //-- if not valid password, can't login, exit
  if(!passwordSignup){
    document.querySelector('#btn-user-signup').disabled=true;  
    return null;
  };
  
  //-- Enable button!
  document.querySelector('#btn-user-signup').disabled=false;
  return null;
}


const _canLogin = event => {

  //-- get values at time of key press is released to verify validity of value
  const emailLogin = (document.querySelector('#email-login').checkValidity());
  const passwordLogin = (document.querySelector('#password-login').checkValidity());
  
  //-- if not valid email, can't login, exit
  if(!emailLogin){
    document.querySelector('#btn-user-login').disabled=true;  
    return null;
  };

  //-- if not valid password, can't login, exit
  if(!passwordLogin){
    document.querySelector('#btn-user-login').disabled=true;  
    return null;
  };
  
  //-- Enable button!
  document.querySelector('#btn-user-login').disabled=false;
  return null;
}



window.addEventListener('load', (event) => {
  //-- prevent normal submission
  // document.querySelector('#btn-user-signup').preventDefault();
  // document.querySelector('#btn-user-login').preventDefault();

  //-- disabling here too, even though in html, just to be safe
  document.querySelector('#btn-user-login').disabled=true;
  document.querySelector('#btn-user-signup').disabled=true;

  //-- login form keystroke listener
  document.querySelector('#email-login').addEventListener("keyup",_canLogin)
  document.querySelector('#password-login').addEventListener("keyup",_canLogin)
  
  //-- new user signup listener
  document.querySelector('#name-signup').addEventListener("keyup",_canSignup);
  document.querySelector('#username-signup').addEventListener("keyup",_canSignup);
  document.querySelector('#email-signup').addEventListener("keyup",_canSignup);
  document.querySelector('#password-signup').addEventListener("keyup",_canSignup);

  
  document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
});
