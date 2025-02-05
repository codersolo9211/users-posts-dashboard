'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserDetails({ params }) {
  const { id } = params;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        const postsResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
        setUser(userResponse.data);
        setPosts(postsResponse.data);
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Address:</strong> {user.address.street}, {user.address.city}</p>
      <p><strong>Company:</strong> {user.company.name}</p>

      <h2 className="text-xl font-semibold mt-4">Posts by {user.name}</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id} className="border p-2 my-2">
            <h3 className="font-bold">{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
