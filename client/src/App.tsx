import { useQuery } from '@tanstack/react-query';
import { serverStatus } from './api';

const App = () => {
  const { data } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: serverStatus,
  });

  console.log(data);

  return <div>App</div>;
};
export default App;
