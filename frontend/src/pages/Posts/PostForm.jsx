import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import api from '../../utils/api';
import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';
import { Save, ChevronLeft, Calendar, Clock } from 'lucide-react';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [status, setStatus] = useState('');

  // Calculate min and max date/time for the current month
  const now = new Date();
  const formatDateTime = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return (new Date(date - offset)).toISOString().slice(0, 16);
  };

  const minDateTime = formatDateTime(new Date());
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59);
  const maxDateTime = formatDateTime(lastDayOfMonth);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        setFetching(true);
        try {
          const res = await api.get(`/posts/${id}`);
          if (res.data.status) {
            setTitle(res.data.data.title);
            setContent(res.data.data.content);
            setStatus(res.data.data.status);
            if (res.data.data.status === 'scheduled' && res.data.data.scheduledAt) {
              setIsScheduled(true);
              setScheduledDate(formatDateTime(new Date(res.data.data.scheduledAt)));
            }
          }
        } catch (error) {
          console.error("Failed to fetch post", error);
        } finally {
          setFetching(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  const editorOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      sideBySideFullscreen: false,
      previewRender: (plainText) => {
        return <div className="markdown-preview">{plainText}</div>; // We can customize this
      },
      status: false,
      minHeight: "400px",
      // Force side-by-side by default if possible or just provide the button
      toolbar: [
        "bold", "italic", "heading", "|", 
        "quote", "unordered-list", "ordered-list", "|", 
        "link", "image", "|", 
        "side-by-side", "fullscreen", "|", 
        "guide"
      ],
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { 
        title, 
        content,
        status: isScheduled ? 'scheduled' : (status === 'published' ? 'published' : 'published'),
        scheduledAt: isScheduled ? scheduledDate : null
      };
      
      let res;
      if (id) {
        res = await api.post('/posts/update', { ...payload, post_id: id });
      } else {
        res = await api.post('/posts/create', payload);
      }

      if (res.data.status) {
        navigate('/');
      }
    } catch (error) {
      console.error("Failed to save post", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container page-wrapper">
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '24px' }}
        >
          <ChevronLeft size={20} /> Back to dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ padding: '40px' }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                Title
              </label>
              <input 
                type="text" 
                className="modern-input" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title..."
                required
                style={{ fontSize: '1.5rem', padding: '15px 20px' }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>
                Content (Markdown)
              </label>
              <div className="custom-mde">
                <SimpleMDE 
                  value={content} 
                  onChange={(val) => setContent(val)} 
                  options={editorOptions}
                />
              </div>
            </div>

            {status !== 'published' && (
              <div style={{ marginBottom: '30px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                  <input 
                    type="checkbox" 
                    id="schedule-toggle"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <label htmlFor="schedule-toggle" style={{ cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} className="text-primary" /> Schedule for later
                  </label>
                </div>

                {isScheduled && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ paddingLeft: '32px' }}
                  >
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Pick a date and time (Current month only)
                    </label>
                    <div style={{ position: 'relative', maxWidth: '300px' }}>
                      <input 
                        type="datetime-local" 
                        className="modern-input"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={minDateTime}
                        max={maxDateTime}
                        required={isScheduled}
                        style={{ paddingLeft: '40px' }}
                      />
                      <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            <button 
              type="submit" 
              className="modern-button" 
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 40px' }}
            >
              <Save size={20} /> Submit
            </button>
          </form>
        </motion.div>
      </main>

      <style>{`
        .custom-mde .editor-toolbar {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px 8px 0 0;
        }
        .custom-mde .editor-toolbar button {
          color: var(--text) !important;
        }
        .custom-mde .editor-toolbar button.active, .custom-mde .editor-toolbar button:hover {
          background: var(--primary);
          color: var(--bg) !important;
        }
        .custom-mde .CodeMirror {
          background: var(--bg);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 0 0 8px 8px;
          font-family: var(--font-mono);
        }
        .custom-mde .editor-preview-side {
          background: var(--surface);
          color: var(--text);
          border-left: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
};

export default PostForm;
