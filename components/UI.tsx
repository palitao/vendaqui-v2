import React from 'react';
import { LucideIcon, Star, ShoppingCart, Share2, X } from 'lucide-react';

// --- BUTTONS ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', icon: Icon, className = '', isLoading, type = "button", ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] tracking-wide rounded-2xl";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 border border-transparent",
    secondary: "bg-secondary hover:bg-secondary-600 text-white shadow-lg shadow-secondary/25 border border-transparent",
    outline: "border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary bg-transparent",
    ghost: "text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 border border-transparent",
    white: "bg-white text-slate-900 hover:bg-slate-50 shadow-md border border-slate-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
    xl: "px-10 py-4 text-lg",
  };

  return (
    <button type={type} className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'} ${children ? 'mr-2' : ''}`} /> : null}
      {children}
    </button>
  );
};

// --- PRODUCT CARD ---
interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  rating: number;
  category: string;
  onClick: () => void;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id, image, title, price, rating, category, onClick, onAddToCart }) => {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Share logic here
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart();
  };

  return (
    <div onClick={onClick} className="group relative bg-white dark:bg-slate-800 rounded-3xl shadow-card hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden h-full flex flex-col hover:-translate-y-1 border border-slate-100 dark:border-slate-700/50">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img 
            src={image} 
            alt={title} 
            onError={(e) => e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges/Tags */}
        <div className="absolute top-4 left-4 z-10">
           <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700">
             {category}
           </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button type="button" onClick={handleShare} className="p-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full text-slate-400 hover:text-blue-500 hover:bg-white shadow-lg transition-colors delay-75">
             <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {title}
            </h3>
        </div>
        
        <div className="flex items-center gap-1 mb-4">
           <div className="flex text-yellow-400">
             {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
             ))}
           </div>
           <span className="text-xs font-medium text-slate-400 ml-2">({rating})</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <div>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Preço</p>
             <span className="text-xl font-extrabold text-slate-900 dark:text-white">{price.toLocaleString('pt-MZ')} <span className="text-sm font-normal text-slate-500">MT</span></span>
          </div>
          
          <button 
            type="button"
            onClick={handleAddToCart}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- INPUTS ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="space-y-2 w-full">
    {label && <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">{label}</label>}
    <input 
      className={`w-full px-5 py-3.5 rounded-2xl border-2 border-transparent bg-slate-100 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium ${className}`}
      {...props}
    />
  </div>
);

// --- BADGE ---
export const Badge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = "bg-primary/10 text-primary border-primary/20" }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${color}`}>
    {children}
  </span>
);

// --- MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with enhanced Blur */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl transition-opacity animate-fade-in" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-fade-in-up flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">{title}</h3>
          <button type="button" onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-slate-600 dark:text-slate-300 custom-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
