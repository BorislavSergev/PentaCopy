/**
 * Animation variants for framer-motion animations used throughout the chat UI
 */

// Sidebar item animations
export const sidebarItemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
    }
  },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

// Chat message animations
export const messageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    }
  }
};

// AI response generation animations
export const thinkingAnimation = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    }
  }
};

export const generatingAnimation = {
  initial: {
    opacity: 0.6,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    }
  }
};

export const summarizingAnimation = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 0.8,
    y: 0,
    transition: {
      duration: 0.3,
    }
  }
};

// Page transitions
export const pageTransition = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    }
  }
};

// Loading dots animation
export const loadingDotsVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

export const dotVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      repeat: Infinity,
      duration: 1
    }
  }
}; 