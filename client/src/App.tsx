import { useQuery } from '@tanstack/react-query';
import { serverStatus } from './api';
import ServerDown from './pages/ServerDown';
import Loader from './components/Loader';

const App = () => {
  const { isPending: loadingServerStatus, isError: isServerError } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: serverStatus,
  });

  // const {} = useQuery({

  // })

  if (isServerError) return <ServerDown />;
  if (loadingServerStatus) return <Loader />;

  return <div></div>;
};
export default App;
