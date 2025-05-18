document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.querySelector('.postsContainer');
    const profileCard = document.getElementById('profileCard');
    const closeProfile = document.querySelector('.close-profile-card');
    const userProfile = document.getElementById('user-profile');
    let skip = 0;
    const limit = 10;
    let loading = false;

    async function fetchPosts(skip) {
        try {
            const response = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
            const data = await response.json();
            return data.posts;
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    }

    async function fetchUser(userId) {
        try {
            const response = await fetch(`https://dummyjson.com/users/${userId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    async function fetchComments(postId) {
        try {
            const response = await fetch(`https://dummyjson.com/comments/post/${postId}`);
            const data = await response.json();
            return data.comments;
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    }

    async function fetchAllUsers() {
        try {
            const response = await fetch('https://dummyjson.com/users?limit=0');
            const data = await response.json();
            return data.users;
        } catch (error) {
            console.error('Error fetching all users:', error);
            return [];
        }
    }

    async function displayPost() {
        if (loading) return;
        loading = true;
        const posts = await fetchPosts(skip);
        skip += limit;
    
        const allUsers = await fetchAllUsers();
        const usersMap = {};
        allUsers.forEach(user => {
            usersMap[user.id] = user;
        });
    
        for (const post of posts) {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
    
            const user = await fetchUser(post.userId);
    
            // Create and append elements
            const h2 = document.createElement('h2');
            h2.textContent = post.title;
            postElement.appendChild(h2);
    
            const pBody = document.createElement('p');
            pBody.textContent = post.body;
            postElement.appendChild(pBody);
    
            const pUsername = document.createElement('p');
            const userImage = document.createElement('img');
            userImage.src = user.image;
            userImage.alt = `Profile picture of ${user.username}`;
            userImage.classList.add('user-profile-image');
    
            const usernameSpan = document.createElement('span');
            usernameSpan.classList.add('username');
            usernameSpan.dataset.userId = post.userId;
            usernameSpan.textContent = user.username;
    
            pUsername.appendChild(userImage);
            pUsername.appendChild(usernameSpan);
            postElement.appendChild(pUsername);
    
            const tagsDiv = document.createElement('div');
            tagsDiv.classList.add('tags');
            const tagsLabel = document.createElement('p');
            tagsLabel.textContent = '🎬Tags:';
            tagsDiv.appendChild(tagsLabel);
            post.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.textContent = tag;
                tagsDiv.appendChild(tagSpan);
            });
            postElement.appendChild(tagsDiv);
    
            const pReactions = document.createElement('p');
            pReactions.innerHTML = `👍 Likes: ${post.reactions.likes}, 👎 Dislikes: ${post.reactions.dislikes}`;
            postElement.appendChild(pReactions);

            // Add "Views" counter
            const pViews = document.createElement('p');
            pViews.innerHTML = `👁️ Views: ${post.views}`;
            postElement.appendChild(pViews);
    
            // Add "Show Comments" button
            const showCommentsButton = document.createElement('button');
            showCommentsButton.textContent = 'Show Comments';
            showCommentsButton.classList.add('show-comments-btn');
            postElement.appendChild(showCommentsButton);
    
            const commentsDiv = document.createElement('div');
            commentsDiv.classList.add('comments');
            commentsDiv.style.display = 'none'; // Initially hidden
            postElement.appendChild(commentsDiv);
    
            showCommentsButton.addEventListener('click', async () => {
                if (commentsDiv.style.display === 'none') {
                    const comments = await fetchComments(post.id);
                    commentsDiv.innerHTML = ''; // Clear previous comments
                    const commentHeader = document.createElement('p');
                    commentHeader.textContent = '💬 Comments:';
                    commentsDiv.appendChild(commentHeader);
    
                    comments.forEach(comment => {
                        const commentDiv = document.createElement('div');
                        commentDiv.classList.add('comment');

                        // Add user profile picture
                        const commentUser = usersMap[comment.user.id];
                        const userImage = document.createElement('img');
                        userImage.src = commentUser.image;
                        userImage.alt = `Profile picture of ${commentUser.username}`;
                        userImage.classList.add('comment-user-image'); // Add a CSS class for styling
                        commentDiv.appendChild(userImage);

                        // Add comment text
                        const commentText = document.createElement('span');
                        commentText.textContent = `${commentUser.firstName} ${commentUser.lastName} (${commentUser.username}): ${comment.body} Likes:👍 ${comment.likes}`;
                        commentDiv.appendChild(commentText);

                commentsDiv.appendChild(commentDiv);
        });

        commentsDiv.style.display = 'block';
        showCommentsButton.textContent = 'Hide Comments';
    } else {
        commentsDiv.style.display = 'none';
        showCommentsButton.textContent = 'Show Comments';
    }
});
    
            postsContainer.appendChild(postElement);
        }
    
        addUsernameClickListeners();
        loading = false;
    }

    function addUsernameClickListeners() {
        const usernames = document.querySelectorAll('.username');
        usernames.forEach(username => {
            username.addEventListener('click', async () => {
                const userId = username.dataset.userId;
                const user = await fetchUser(userId);
                if (user) {
                    // Clear previous content
                    userProfile.innerHTML = '';

                    // Add user image
                    const userImage = document.createElement('img');
                    userImage.src = user.image;
                    userImage.alt = `Profile picture of ${user.firstName} ${user.lastName}`;
                    userProfile.appendChild(userImage);

                    const h2 = document.createElement('h2');
                    h2.textContent = `${user.firstName} ${user.lastName}`;
                    userProfile.appendChild(h2);

                    const pEmail = document.createElement('p');
                    pEmail.textContent = `Email: ${user.email}`;
                    userProfile.appendChild(pEmail);

                    const pAddress = document.createElement('p');
                    pAddress.textContent = `Address: ${user.address.address}, ${user.address.city}`;
                    userProfile.appendChild(pAddress);

                    profileCard.style.display = 'block';
                }
            });
        });
    }

    closeProfile.onclick = function() {
        profileCard.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == profileCard) {
            profileCard.style.display = 'none';
        }
    };
    
    // Create Go to Top button
const goToTopButton = document.createElement('button');
goToTopButton.textContent = 'Go to Top';
goToTopButton.id = 'goToTopBtn';
goToTopButton.style.display = 'none'; // Initially hidden
document.body.appendChild(goToTopButton);

// Scroll to top on click
goToTopButton.onclick = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Show/hide button on scroll
window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        goToTopButton.style.display = 'block';
    } else {
        goToTopButton.style.display = 'none';
    }
};
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
        displayPost();
    }
});

displayPost();
}
);
