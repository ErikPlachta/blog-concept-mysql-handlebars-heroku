const newPostTemplate={
	"title" : "",
	"content" : "",
	"type" : "user",
	"status" : true,
	"category" : "post",
	"topics" : "post"
}


const postNewPost = async (event) => {
    // post-new-post

    const title = document.querySelector('#post-new-post-title').value.trim();
    const body = document.querySelector('#post-new-post-text').value.trim();

    if (title && body) {
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