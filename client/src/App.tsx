import { useQuery } from "@tanstack/react-query";
import { serverStatus } from "./api";
import ServerDown from "./pages/ServerDown";
import Loader from "./components/Loader";
import AppRoutes from "./AppRoutes";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  const { isPending: loadingServerStatus, isError: isServerError } = useQuery({
    queryKey: ["serverStatus"],
    queryFn: serverStatus,
  });

  if (isServerError) return <ServerDown />;
  if (loadingServerStatus) return <Loader />;

  return (
    <>
      <AppRoutes />;
      <Toaster />
    </>
  );
};
export default App;
