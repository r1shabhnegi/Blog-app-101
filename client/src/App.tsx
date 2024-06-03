import { useQuery } from '@tanstack/react-query';
import { serverStatus } from './api';
import ServerDown from './pages/ServerDown';

const App = () => {
  const { isPending, isSuccess } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: serverStatus,
  });

  console.log(isPending);
  console.log('isSucc', isSuccess);

  if (isSuccess) return <ServerDown />;

  return <div>App</div>;
};
export default App;
