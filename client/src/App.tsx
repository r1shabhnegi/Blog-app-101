import { useQuery } from "@tanstack/react-query";
import { serverStatus } from "./api";
import ServerDown from "./pages/ServerDown";
import Loader from "./components/Loader";
import AppRoutes from "./AppRoutes";

const App = () => {
  const { isPending: loadingServerStatus, isError: isServerError } = useQuery({
    queryKey: ["serverStatus"],
    queryFn: serverStatus,
  });

  if (isServerError) return <ServerDown />;
  if (loadingServerStatus) return <Loader />;

  return <AppRoutes />;
};
export default App;
