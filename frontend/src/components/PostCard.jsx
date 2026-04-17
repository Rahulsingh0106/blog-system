import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { User as UserIcon, Edit3, Trash2, ArrowRight } from 'lucide-react';

const PostCard = ({ post, currentUser, onDelete }) => {
  const isAuthor = currentUser && currentUser._id === post.user_id;

  const handleDelete = () => {
    onDelete && onDelete(post._id);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass" 
      style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontWeight: '600' }}>
          ARTICLE
        </span>
        
        {isAuthor && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to={`/edit-post/${post._id}`} className="text-muted hover-primary" style={{ transition: 'color 0.2s' }}>
              <Edit3 size={18} />
            </Link>
            <button 
              onClick={handleDelete}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              className="text-muted hover-accent"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', lineHeight: '1.4' }}>{post.title}</h3>
      
      <div style={{ 
        flex: 1, 
        fontSize: '0.9rem', 
        color: 'var(--text-muted)', 
        overflow: 'hidden', 
        display: '-webkit-box', 
        WebkitLineClamp: '3', 
        WebkitBoxOrient: 'vertical',
        marginBottom: '20px'
      }}>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <UserIcon size={16} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{isAuthor ? 'You' : 'System_Node'}</span>
        </div>
        
        <Link to={`/edit-post/${post._id}`} style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '600' }}>
          READ_MORE <ArrowRight size={16} />
        </Link>
      </div>

      <style>{`
        .hover-primary:hover { color: var(--primary) !important; }
        .hover-accent:hover { color: var(--accent) !important; }
      `}</style>
    </motion.div>
  );
};

export default PostCard;
