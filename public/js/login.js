const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    const responseLogin = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    
    //-- If was able to login
    if (responseLogin.ok) 
      { document.location.replace('/'); }
    if (!(responseLogin.ok))
      { console.log('//-- Failed to log in. check with admin.'); }
      // { 
        
      //   //-- Update User logged-in status and last log in date
      //   const responseUpdate = await fetch('/api/users/', { 
      //     method: 'PUT',
      //     // body: {''},
      //     // headers: { 'Content-Type': 'application/json' },
      //   });
      //   console.log(`responseUpdate: ${responseUpdate}`,responseUpdate)
      //   if (responseUpdate.ok) 
      //     { document.location.replace('/'); }

      //   if (!(responseUpdate.ok))
      //     { 
      //       // console.log(responseUpdate)
      //       console.log('//-- Failed to log in. check with admin.'); 
      //     }
      // } 
   
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);



  const signupFormHandler = async (event) => {
    event.preventDefault();
  
    const name = document.querySelector("#name-signup").value.trim();
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
  
    if (username && email && password) {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({ name, username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        console.log('//-- Failed to sign up. Try again or check with admin.');
      }
    }
  };

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
