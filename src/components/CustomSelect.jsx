import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ value, onChange, options, placeholder, label, containerClass = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`custom-select-container ${containerClass} ${isOpen ? 'is-open' : ''}`} ref={containerRef}>
      {label && <label className="custom-select-label">{label}</label>}
      <div
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <i className={`chevron ${isOpen ? 'up' : 'down'}`}></i>
      </div>

      {isOpen && (
        <ul className="custom-select-options">
          {options.map((option) => (
            <li
              key={option.value}
              className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange({ target: { value: option.value } });
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .custom-select-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          z-index: 10;
        }

        .custom-select-container.is-open {
          z-index: 2100;
        }

        .custom-select-label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--secondary-color);
          padding-left: 2px;
        }

        .custom-select-trigger {
          width: 100%;
          padding: 0.9rem 1.25rem;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: var(--font-main);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(5px);
          user-select: none;
        }

        .dark .custom-select-trigger {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #F8FAFC;
        }

        .custom-select-trigger:hover {
          border-color: var(--secondary-color);
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.1);
        }

        .dark .custom-select-trigger:hover {
          background: rgba(30, 41, 59, 0.9);
          box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.5);
        }

        .custom-select-trigger.open {
          border-color: var(--secondary-color);
          background: white;
          box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1), 0 10px 20px -10px rgba(0, 0, 0, 0.1);
        }

        .dark .custom-select-trigger.open {
          background: #0F1728;
          box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1), 0 10px 25px -10px rgba(0, 0, 0, 0.5);
        }

        .chevron {
          width: 0.6rem;
          height: 0.6rem;
          border-right: 2px solid var(--secondary-color);
          border-bottom: 2px solid var(--secondary-color);
          transform: rotate(45deg);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 2px;
        }

        .chevron.up {
          transform: rotate(-135deg);
          margin-bottom: -4px;
        }

        .custom-select-options {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          right: 0;
          z-index: 2000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: var(--radius-md);
          padding: 0.5rem;
          list-style: none;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.15);
          max-height: 250px;
          overflow-y: auto;
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          scrollbar-width: thin;
          scrollbar-color: var(--secondary-color) transparent;
        }

        .dark .custom-select-options {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
        }

        .custom-select-option {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 2px;
        }

        .custom-select-option:last-child {
          margin-bottom: 0;
        }

        .custom-select-option:hover {
          background: rgba(197, 160, 89, 0.1);
          color: var(--secondary-color);
          transform: translateX(5px);
        }

        .custom-select-option.selected {
          background: var(--secondary-color);
          color: white;
        }

        .dark .custom-select-option.selected {
          color: #0F172A;
        }

        .compact-select .custom-select-trigger {
          padding: 0.4rem 0.75rem;
          font-size: 0.85rem;
          border-radius: var(--radius-xs);
        }

        .compact-select .chevron {
          width: 0.45rem;
          height: 0.45rem;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CustomSelect;
