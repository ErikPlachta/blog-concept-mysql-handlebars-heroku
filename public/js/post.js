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
  "post_id" : "", //-- the parent post id
  "title" : "", //-- the users reply title
  "content" :"", //-- users reply message
  "resources_id" : 1, //-- commented out for now but including
  "status" : 1 //-- not deleted
}      


//-- API CALL for if logged-in user owns comment and is viewing on post page, can delete posts.
  //-- if delete, navigate home, delete all replies
const _deletePost = async post =>{

  const postId = post.target.parentNode.dataset.userid;
  const response = await fetch(`../api/posts/${postId}`, {
    method: 'DELETE',
    body: '',
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.ok) {
      document.location.replace('/');
    } else {
      alert('failed to post.');
    }
  return null;
}

//-- API CALL for if logged-in user owns comment and is viewing on post page, can delete comments
const _deleteComment = async comment =>{
  const commentId = comment.target.parentNode.parentNode.dataset.id;
  console.log(commentId)
  const response = await fetch(`../api/comments/${commentId}`, {
    method: 'DELETE',
    body: '',
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.ok) {
      document.location.replace(window.location.pathname);
    } else {
      alert('failed to post.');
    }
  return null;
}

//-- for all elements of type reply that match data-id value of user logged in ID's, show option to delete
const _canDelete = () => {
  
  //-- get all comments, see if logged in user owns, is yes, option to delete
  const allComments = document.querySelectorAll(".comment.card");
  [].forEach.call(allComments, function(comment){
    if(comment.dataset.userid === document.querySelector("#profile").dataset.userid){
      comment.querySelector( ".delete-comment" ).style.display = "block";
      comment.querySelector( ".delete-comment" ).addEventListener("click",_deleteComment);
    }
  });

  //-- if in a post you can delete a post. Look for all logged-in user owns then allow delete
  if(window.location.pathname.includes("/post")){
    //-- get all posts, see if logged in user owns, is yes, option to delete
    const postDetails = document.querySelector(".post-details");
    
    
    if(postDetails.dataset.userid === document.querySelector("#profile").dataset.userid){
      postDetails.querySelector( ".delete-post" ).style.display = "block";
      postDetails.querySelector( ".delete-post" ).addEventListener("click",_deletePost)
    }
  }
};


const postNewPost = async (event) => {
  //-- Post-new-post or reply based on location

  const title = document.querySelector('#post-new-post-title').value.trim();
  const body = document.querySelector('#post-new-post-text').value.trim();

  if (title && body) {

    //-- POSTING A  REPLY from /post/:id
    if(window.location.pathname.includes("/post/")){
      
      //-- BUILDING CONTENT TO POST
      newReplyTemplate.post_id = document.querySelector(".post-details").dataset.id; //-- the parent post id
      newReplyTemplate.title = title;
      newReplyTemplate.content = body;
      
      //-- is user-id in content does not match content
      // if(newReplyTemplate.user_id === document.querySelector("#profile").dataset.userid){  
      // console.log("Reply to post...")
      // console.table(newReplyTemplate)
      // alert("worked!")

      const response = await fetch('/../api/comments', {
        method: 'POST',
        body: (JSON.stringify(newReplyTemplate)),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
          document.location.replace(window.location.pathname);
        //-- Otherwise failed to post
          //TODO:: 04/03/2022 #EP || Must be offline, add offline management with Service Worker
      } else {
          alert('failed to post.');
      }
      
      //-- exit
      return null;
    }


    //-- POSTING A POST from profile
    if(window.location.pathname.includes("/profile")){
      console.log("from profile")

      //-- grab content from post
      newPostTemplate.title = title;
      newPostTemplate.content = body;

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

    //-- POSTING A POST from homepage
    if(window.location.pathname === ("/")){
      console.log("homepage")

      //-- grab content from post
      newPostTemplate.title = title;
      newPostTemplate.content = body;

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

//----------------------------------------------------------------------------//
//-- ON LOAD EVENTS

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

  //-- check page to see what can be deleted based on logged-in user
  _canDelete();
});