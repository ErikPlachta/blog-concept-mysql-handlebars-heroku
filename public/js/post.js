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

document.querySelector('.post-new-post').onsubmit = event => {
    event.preventDefault();
    postNewPost(event);
};