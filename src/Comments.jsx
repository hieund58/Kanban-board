import React, { useEffect, useState } from 'react';

const PostsWithComments = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const postsData = await postsResponse.json();
        setPosts(postsData);

        // Lấy danh sách comment
        const commentsResponse = await fetch('https://jsonplaceholder.typicode.com/comments');
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Posts with Comments</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <ul>
              {comments
                .filter(comment => comment.postId === post.id)
                .map(comment => (
                  <li key={comment.id}>{comment.body}</li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsWithComments;
