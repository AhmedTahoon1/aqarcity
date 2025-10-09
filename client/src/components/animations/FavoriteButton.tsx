import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  className?: string;
}

export default function FavoriteButton({ isFavorite, onClick, className = '' }: FavoriteButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <motion.div
        animate={isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`w-4 h-4 transition-all duration-300 ${
            isFavorite 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-600 hover:text-red-500'
          }`} 
        />
      </motion.div>
    </motion.button>
  );
}