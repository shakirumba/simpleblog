import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

function BlogList() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user);
    console.log( user.id ); 
    
    const handleEdit = (postId) => {
        console.log({ postId }); 
        navigate(`/EditBlog/${postId}`);
        };


    const handleDelete = async (postId) => {
    console.log({ postId });
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", postId);

    if (error) {
        console.error("Error deleting post:", error);
    } else {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    }
    };

    const handleView = (postId) => {
        console.log({ postId }); 
        navigate(`/ViewBlog/${postId}`);
        };
   

 

  useEffect(() => {
  async function fetchPosts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
       *,
        users(
        auth_id,
          username,
          role
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error fetching posts:", error);
    } else {
      
      setPosts(data);
    }

    setLoading(false);
  }

  fetchPosts();
}, []);

console.log("Joined data:", posts)
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); 

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">From the blog</h2>
          <p className="mt-2 text-lg/8 text-gray-300">Learn how to grow your business with our expert advice.</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-700 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {currentPosts.map((post) => (
            <article key={post.id} className="flex max-w-xl flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.created_at} className="text-gray-400">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                    })}
                    </time>
                <a
                  href={post.category.href}
                  className="relative z-10 rounded-full bg-gray-800/60 px-3 py-1.5 font-medium text-gray-300 hover:bg-gray-800"
                >
                  {post.category}
                </a>
                
              {user.id === post.author_id && (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil-square"
                        viewBox="0 0 16 16"
                        onClick={() => handleEdit(post.id)}
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293z" />
                        <path d="M13.752 4.396 4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                        />
                      </svg>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                        onClick={() => handleDelete(post.id)}
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5" />
                        <path d="M8 5.5A.5.5 0 0 1 8.5 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5" />
                        <path d="M10.5 5.5A.5.5 0 0 1 11 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1z" />
                      </svg>
                    </>
                  )}

               

               
 

              </div>

              <div className="group relative grow"
               onClick={() => handleView(post.id)}
              >
                <h3 className="mt-3 text-lg/6 font-semibold text-white group-hover:text-gray-300">
                  <a href="#">
                    <span className="absolute inset-0" />
                    {post.title}
                  </a>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-400">{post.description}</p>
              </div>

              <div className="relative mt-8 flex items-center gap-x-4 justify-self-end">
                <img alt="" src='https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?...' className="size-10 rounded-full bg-gray-800" />
                <div className="text-sm/6">
                  <p className="font-semibold text-white">
                    <a href="#">
                      <span className="absolute inset-0" />
                      {post.users.username}
                    </a>
                  </p>
                  <p className="text-gray-400">{post.users.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  );
}

export default BlogList;
