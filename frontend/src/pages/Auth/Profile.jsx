import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';
import PostCard from '../../components/PostCard';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Camera, Save, X as CloseIcon, Edit3 } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const Profile = () => {
  const { user, logout } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null });

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (user) {
      setTempName(user.name);
      setAvatarPreview(user.avatar || null);
    }

    const fetchUserPosts = async () => {
      try {
        const res = await api.get('/posts');
        if (res.data.status) {
          setUserPosts(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user posts", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchUserPosts();
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      setTempName(user.name);
      setAvatarPreview(user.avatar || null);
    }
    setIsEditing(!isEditing);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    // Backend Implementation Placeholder
    console.log("Updating profile with:", { name: tempName, avatar: avatarPreview });
    setIsEditing(false);
    alert("Profile update UI complete. Backend integration required.");
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
        setUserPosts(userPosts.filter(p => p._id !== postId));
      }
    } catch (error) {
      alert("System failure: Could not delete record.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container page-wrapper">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '40px' }}>

          {/* User Sidebar */}
          <aside>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass"
              style={{ padding: '40px', textAlign: 'center', position: 'sticky', top: '130px', overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px' }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 0 30px var(--primary-glow)',
                  overflow: 'hidden'
                }}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <UserIcon size={50} />
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                    }}
                  >
                    <Camera size={16} />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input
                    className="modern-input"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter name"
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" className="modern-button" onClick={handleEditToggle} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid var(--border)', 'color': 'black' }}>
                      <CloseIcon size={18} /> Cancel
                    </button>
                    <button type="submit" className="modern-button" style={{ flex: 2, padding: '8px' }}>
                      <Save size={18} style={{ marginRight: '5px' }} /> Update
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{user.name}</h2>
                  <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '25px' }}>Blog Author</p>
                  <button
                    onClick={handleEditToggle}
                    className="text-primary"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px', width: '100%', justifyContent: 'center' }}
                  >
                    <Edit3 size={16} /> Edit Profile
                  </button>
                </>
              )}

              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px', borderTop: '1px solid var(--border)', paddingTop: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <Mail size={16} className="text-primary" />
                  <span>{user.email}</span>
                </div>
              </div>

              <button
                className="modern-button"
                style={{ width: '100%', marginTop: '30px', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}
                onClick={logout}
              >
                Logout
              </button>
            </motion.div>
          </aside>

          {/* User Posts Content */}
          <section>
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Your Logs</h3>
              <p className="text-muted">Personal records archived in the system.</p>
            </div>

            {loading ? (
              <div>Scanning memory...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {userPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUser={user}
                    onDelete={handleDeleteClick}
                  />
                ))}

                {userPosts.length === 0 && (
                  <div className="glass flex-center" style={{ height: '200px' }}>
                    <div className="text-muted">No personal logs found.</div>
                  </div>
                )}
              </div>
            )}
          </section>

        </div>
      </main>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Log?"
        message="This operation is permanent. Are you sure you want to purge this record from your archives?"
        confirmText="Purge Log"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, postId: null })}
        type="danger"
      />
    </div>
  );
};

export default Profile;
