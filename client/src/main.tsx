import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/_store.ts";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// import { HashRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { Toaster } from "./components/ui/toaster.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
      </QueryClientProvider>
    </Provider>
  </HashRouter>
);
