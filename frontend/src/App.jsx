import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Helper functions to interact with localStorage
const loadPosts = () => {
  const stored = window.localStorage.getItem("posts");
  return stored ? JSON.parse(stored) : [];
};

const savePosts = (posts) => {
  window.localStorage.setItem("posts", JSON.stringify(posts));
};

function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Load posts from localStorage on mount
  useEffect(() => {
    const storedPosts = loadPosts();
    setPosts(storedPosts);
  }, []);

  // Handle delete (using localStorage)
  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setDeletingId(postId);
      try {
        const updatedPosts = posts.filter((post) => post._id !== postId);
        savePosts(updatedPosts);
        setPosts(updatedPosts);
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Handle submit (create new post and save to localStorage)
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Use Date.now() as a unique id
      const newPost = {
        _id: Date.now(),
        title: form.title,
        content: form.content,
        createdAt: new Date().toISOString(),
      };
      const updatedPosts = [...posts, newPost];
      savePosts(updatedPosts);
      setPosts(updatedPosts);
      setForm({ title: "", content: "" });
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and sort posts
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Featured posts (top 2 most recent)
  const featuredPosts = sortedPosts.slice(0, 2);
  const regularPosts = sortedPosts.slice(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 font-sans px-4 sm:px-8 py-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with Navigation */}
      <header className="relative z-10">
        <nav className="flex justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <h1 className="text-5xl p-4 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 tracking-wide">
              Blogger
            </h1>
          </motion.div>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Share your thoughts with the world. Our platform makes it easy to
            write, publish, and connect with readers.
          </p>
        </motion.div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Blog Form with Floating Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-3xl mx-auto bg-gray-900/70 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-gray-800 mb-12 hover:shadow-indigo-900/30 transition-shadow"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></span>
            Create New Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Post Title"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Write your content..."
                rows="5"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
                required
              ></textarea>
            </div>
            <div className="flex justify-between items-center">
              <motion.button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg transition flex items-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publishing..." : "Publish Post"}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Posts Section */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 sm:mb-0">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                {activeTab === "featured" ? "Featured" : "Recent"} Posts
              </span>
            </h2>
            <div className="flex space-x-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search posts..."
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                    activeTab === "recent"
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setActiveTab("featured")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                    activeTab === "featured"
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Featured
                </button>
              </div>
            </div>
          </div>
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-medium text-gray-400 mb-2">
                No posts found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery
                  ? "Try a different search term"
                  : "Start writing something awesome!"}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {activeTab === "featured" && featuredPosts.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredPosts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative group bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-800 hover:border-indigo-500/30 transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                      <div className="h-48 bg-indigo-900/20"></div>
                      <div className="p-6 relative z-20">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="px-2 py-1 text-xs font-medium bg-indigo-600 text-white rounded-full">
                            Featured
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition">
                          {post.title}
                        </h3>
                        <p className="text-gray-300 mb-4 line-clamp-2">
                          {post.content}
                        </p>
                        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center transition">
                          Read more
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === "recent" ? sortedPosts : regularPosts).map(
                  (post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-5 hover:shadow-lg hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-gray-500 hover:text-red-400 transition"
                          disabled={deletingId === post._id}
                        >
                          {deletingId === post._id ? (
                            <svg
                              className="animate-spin h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {post.content}
                      </p>
                      <div className="flex justify-between items-center">
                        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center transition">
                          Read more
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 pt-8 pb-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
              <div className="flex items-center">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                  Blogger
                </h1>
                <span className="ml-4 text-sm text-gray-500">
                  © 2025 Blogger. All rights reserved.
                </span>
              </div>
              <div className="mt-2 md:mt-0 md:ml-8">
                <span className="text-md text-gray-300">
                  Amar Tatrasi
                </span>
              </div>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://github.com/tatrasiamar"
                className="text-gray-400 hover:text-indigo-400 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/amar-tatrasi"
                className="text-gray-400 hover:text-indigo-400 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-1.337-.027-3.062-1.868-3.062-1.868 0-2.154 1.459-2.154 2.969v5.697h-3v-11h2.884v1.5h.041c.402-.762 1.386-1.563 2.857-1.563 3.054 0 3.619 2.011 3.619 4.629v6.434z" />
                </svg>
              </a>
              <a
                href="mailto:tatrasiamar123@gmail.com"
                className="text-gray-400 hover:text-indigo-400 transition"
              >
                <span className="sr-only">Email</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a1 1 0 001.22 0L20 8m0 0l-8 5-8-5m16 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8"
                  />
                </svg>
              </a>
              <a
                href="tel:7330807277"
                className="text-gray-400 hover:text-indigo-400 transition"
              >
                <span className="sr-only">Phone</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a2 2 0 011.967 1.58l1.1 4.4a2 2 0 01-.485 1.99l-2.2 2.2a11.048 11.048 0 005 5l2.2-2.2a2 2 0 011.99-.485l4.4 1.1A2 2 0 0121 16.72V20a2 2 0 01-2 2h-1C9.163 22 2 14.837 2 6V5z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default App;