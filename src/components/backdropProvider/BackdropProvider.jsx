import React, { createContext, useContext, useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// Tạo Context cho Backdrop
const BackdropContext = createContext();

// Hook để sử dụng BackdropContext
export const useBackdrop = () => useContext(BackdropContext);

// Provider để bao bọc các component cần dùng backdrop
export function BackdropProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if(isLoading){
        setTimeout(() => {
            stopLoading(); // Tự động tắt sau 10s
        }, 10000);
    }
  }, [isLoading]);

  return (
    <BackdropContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </BackdropContext.Provider>
  );
}
