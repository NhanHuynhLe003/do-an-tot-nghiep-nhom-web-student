import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BackdropProvider } from "./components/backdropProvider/BackdropProvider";
// Khởi tạo queryClient
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <CssBaseline></CssBaseline>
        <BackdropProvider>
          <App />
        </BackdropProvider>

        {/* Thêm Toast hiển thị  */}
        <ToastContainer
          position="bottom-left"
          theme="light"
          pauseOnHover={false}
          draggable={true}
        ></ToastContainer>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
