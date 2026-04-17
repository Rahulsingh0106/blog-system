import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
  if (!isOpen) return null;

  const accentColor = type === "danger" ? "var(--accent)" : "var(--primary)";

  return (
    <AnimatePresence>
      <div className="modal-overlay" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }} onClick={onCancel}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass"
          style={{
            maxWidth: '400px',
            width: '100%',
            padding: '30px',
            position: 'relative',
            borderTop: `4px solid ${accentColor}`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onCancel}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: `${accentColor}15`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: accentColor
            }}>
              <AlertCircle size={32} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{title}</h3>
              <p className="text-muted" style={{ lineHeight: '1.5' }}>{message}</p>
            </div>

            <div style={{ display: 'flex', gap: '15px', width: '100%', marginTop: '10px' }}>
              <button 
                className="modern-button" 
                style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
                onClick={onCancel}
              >
                {cancelText}
              </button>
              <button 
                className="modern-button" 
                style={{ flex: 1, backgroundColor: accentColor }}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
