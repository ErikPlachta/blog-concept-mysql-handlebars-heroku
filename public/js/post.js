//-- what a post body needs to contain. Used in Profile and homepage
const newPostTemplate={
  "title" : "",
  "content" : "",
  "type" : "user",
  "status" : true,
  "category" : "post",
  "topics" : "post"
}

//-- what a reply body needs to contain. Used in /post/:id
const newReplyTemplate={
  "user_id" : document.querySelector("#profile").dataset.id, //-- user logged in
  "post_id" : document.querySelector(".post-details").dataset.id, //-- the parent post id
  "title" : "", //-- the users reply title
  "content" :"", //-- users reply message
  "resources_id" : null, //-- commented out for now but including
  "status" : 1 //-- not deleted
}      


const postNewPost = async (event) => {
    // post-new-post

    const title = document.querySelector('#post-new-post-title').value.trim();
    const body = document.querySelector('#post-new-post-text').value.trim();

    if (title && body) {
        newPostTemplate.title = title;
        newPostTemplate.content = body;

        //-- if posting a comment to a post, different route than if profile or homepage
        if(window.location.pathname.includes("/post/")){
          console.log(window.location.pathname.split("/")[2])
          newReplyTemplate.post_id = window.location.pathname.split("/")[2];
          const response = await fetch('api/posts/', {
            method: 'POST',
            body: (JSON.stringify(newPostTemplate)),
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.ok) {
              document.location.replace('/');
            } else {
              alert('failed to post.');
            }
          return null;
        }


        if(window.location.pathname.includes("/profile")){
          console.log("from profile")
          const response = await fetch('api/posts/', {
            method: 'POST',
            body: (JSON.stringify(newPostTemplate)),
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.ok) {
              document.location.replace('/profile');
            } else {
              alert('failed to post.');
            }
          return null;
        };


        if(window.location.pathname === ("/")){
          console.log("homepage")
          const response = await fetch('api/posts/', {
            method: 'POST',
            body: (JSON.stringify(newPostTemplate)),
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.ok) {
              document.location.replace('/');
            } else {
              alert('failed to post.');
            }
            return null;
        };
    };

        //TODO: 04/02/2022 #EP || Add posting animation
        //TODO: 04/02/2022 #EP || Add refresh once posted
}


const _canPost = event => {
  // console.log(event.target.value);

  const titleLength = (document.querySelector('#post-new-post-title').value).length;
  const bodyLength = (document.querySelector('#post-new-post-text').value).length;

  if(titleLength < 5){
    document.querySelector('#post-new-post-button').disabled=true;  
    return null;
  };
  if(bodyLength < 10){
    document.querySelector('#post-new-post-button').disabled=true;  
    return null;
  };
  
  document.querySelector('#post-new-post-button').disabled=false;

}

window.addEventListener('load', (event) => {
  
  //-- Disable Post Button by default
  document.querySelector('#post-new-post-button').disabled=true;  

  //-- See if should still be disabled
  document.querySelector('#post-new-post-text').addEventListener("keyup",_canPost)
  document.querySelector('#post-new-post-title').addEventListener("keyup",_canPost)

  //-- IF SUBMIT HAPPENS, SEE IF GOOD TO POST
  document.querySelector('.post-new-post').onsubmit = event => {
    event.preventDefault();
    postNewPost(event);
  };
});