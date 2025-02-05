Overview: This is a next js application that displays a list of users and their related posts. Users can be searched, sorted, and clicked to view detailed information . The posts section supportsinfinite scrolling.
Features: Fetch users and posts from json placeholder API, search users by name or email, sort users by name or company, view users details and related posts on a dynamic route, implement infinite scrolling for posts.
Installation: install dependencies- npm install, start the server by running 'npm run dev'
API endpoints Used:  Users- 'https://jsonplaceholder.typicode.com/users', Posts: 'https://jsonplaceholder.typicode.com/posts'.
search for users using the input field.
click a user  to navigate /users/[id] for more details.
scroll down in posts section to load more posts dynamically.
Technologies Used: Next.js, React Hooks, Axios for API requests, Tailwind css for styling.
Approach i followed for building the project: Project Setup
I chose the following technologies based on the project requirements:
Next.js (App Router): Server-side rendering, optimized performance
React Hooks: Manage state efficiently
Axios: Handle API requests
Tailwind css:  Style the ui cleanly and responsively
Initializes Project by running following command: 'npx create-next-app@latest users-posts-dashboard', 'cd users-posts-dashboard'.
Install dependencies: 'npm install axios'.
State Management: Used 'useState' to manage users list.Used 'useEffect' to fetch users on component mount.
Implimentation:      useEffect(() => {
  setLoading(true);
  axios.get('https://jsonplaceholder.typicode.com/users')
    .then(response => {
      setUsers(response.data);
      setFilteredUsers(response.data);  // Keep a copy for searching
    })
    .catch(err => setError('Failed to load users'))
    .finally(() => setLoading(false));
}, []);   // This ensures that the page is loading only once and also handled the error properly.
Search Users
Implemented search filtering on name & email.
Used controlled input with useState().
Sorting Users: Sorted by name or company name dynamically.
const handleSearch = (e) => {
  const query = e.target.value.toLowerCase();
  setSearch(query);
  setFilteredUsers(users.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  ));
};

const handleSort = (e) => {
  const criterion = e.target.value;
  setSortBy(criterion);

  setFilteredUsers(prevUsers => [...prevUsers].sort((a, b) => {
    const aValue = criterion.includes('.') 
      ? criterion.split('.').reduce((obj, key) => obj?.[key], a) 
      : a[criterion];

    const bValue = criterion.includes('.') 
      ? criterion.split('.').reduce((obj, key) => obj?.[key], b) 
      : b[criterion];

    return (aValue?.toLowerCase() || '') > (bValue?.toLowerCase() || '') ? 1 : -1;
  }));
}; // Efficiently filters data without extra API calls. Ensures sorting works.
Implementing User Detail Page (/users/[id]).
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
      <p><strong>Company:</strong> {user.company.name}</p>
      <h2 className="text-xl font-semibold mt-4">Posts</h2>
      {posts.map(post => (
        <div key={post.id} className="border p-2 my-2">
          <h3 className="font-bold">{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
} // Uses Next.js params to get user ID dynamically.
Fetches data on page load for fast navigation.
Displays user details and posts in a clean layout.
Implementing Infinite Scrolling for Posts.  
Used useState() for pagination state.
Fetch 10 posts per page on button click.
