import React from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  id,
  hoverEffect = true
}) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`glass rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
        hoverEffect ? 'hover:border-brand-cyan/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.06)] hover:bg-slate-900/30' : ''
      } ${className}`}
    >
      {/* Absolute faint background gradient circles for extra premium feel */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
