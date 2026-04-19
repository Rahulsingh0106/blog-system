import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';
import PostCard from '../../components/PostCard';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/useAuth';
import ConfirmationModal from '../../components/ConfirmationModal';
import { io } from 'socket.io-client';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null });

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      if (res.data.status) {
        setPosts(res.data.data);
        setFilteredPosts(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const socket = io("http://localhost:5000");

    socket.on("post_published", (newPost) => {
      console.log("Real-time update: New post published!", newPost);
      setPosts((prevPosts) => {
        // Avoid duplicate additions
        if (prevPosts.some(p => p._id === newPost._id)) return prevPosts;
        const updated = [newPost, ...prevPosts];
        setFilteredPosts(updated);
        return updated;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSearch = (query) => {
    const term = query.toLowerCase();
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term)
    );
    setFilteredPosts(filtered);
  };

  const handleDeleteClick = (postId) => {
    setDeleteModal({ isOpen: true, postId });
  };

  const handleConfirmDelete = async () => {
    const { postId } = deleteModal;
    setDeleteModal({ isOpen: false, postId: null });
    try {
      const res = await api.get(`/posts/delete/${postId}`);
      if (res.data.status) {
        setPosts(posts.filter(p => p._id !== postId));
        setFilteredPosts(filteredPosts.filter(p => p._id !== postId));
      }
    } catch (error) {
      alert("Unauthorized: Only the author can delete this record.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar onSearch={handleSearch} />

      <main className="container page-wrapper">
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Dashboard</h2>
          <p className="text-muted">Exploring the collective intelligence of the Nebula.</p>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: '200px' }}>
            <div className="text-primary">Fetching system data...</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard 
                  post={post} 
                  currentUser={user} 
                  onDelete={handleDeleteClick}
                />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="glass flex-center" style={{ height: '300px', flexDirection: 'column', gap: '20px' }}>
            <div className="text-muted">No posts found in the current sector.</div>
          </div>
        )}
      </main>

      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        title="Delete Post?"
        message="This action is irreversible. The log will be permanently purged from the system."
        confirmText="Purge Log"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, postId: null })}
        type="danger"
      />
    </div>
  );
};

export default Dashboard;
