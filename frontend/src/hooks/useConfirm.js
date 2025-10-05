import { useState, useCallback } from 'react';

/**
 * Custom hook for handling confirmation dialogs
 * @returns {Object} An object containing the confirmation function
 */
const useConfirm = () => {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const confirm = useCallback((title, message) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
          setState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  }, []);

  return {
    ...state,
    confirm,
  };
};

export default useConfirm;
