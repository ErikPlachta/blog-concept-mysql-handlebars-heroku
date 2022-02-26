//-- LOGIN FORM
const loginFormHandler = async (event) => {
  
  event.preventDefault(); //-- prevent default submission behavior

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();
  //-- if user provided a username and password inform, attempt to login
  if (email && password) {
    const responseLogin = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
    });

    //-- Login success. Routing to homepage.
    if (responseLogin.ok)  { document.location.replace('/')}  
    //-- If was unable to login, console error
    // TODO:: 02/26/2022 #EP || Add UI update
    if (!(responseLogin.ok)){ console.log('//-- Failed to log in. check with admin.'); }
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

  if (name && username && email && password) {
    const response = await fetch('/api/users/signup', {
            method: 'POST',
            body: JSON.stringify({ name, username, email, password }),
            headers: { 'Content-Type': 'application/json' },
    });
    //-- Created user success. Routing to homepage.
    if (response.ok) { document.location.replace('/');}
    // TODO:: 02/26/2022 #EP || Add UI update
    if (!response.ok){ console.log('//-- Failed to sign up. Check with admin.');}
  }
};

//-- add listner for 
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
