import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial={{ x: '100%', opacity: 0, filter: 'blur(10px)' }}
            animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ x: '-100%', opacity: 0, filter: 'blur(10px)' }}
            transition={{
                type: 'tween',
                ease: 'circOut',
                duration: 0.2
            }}
            style={{
                width: '100%'
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
