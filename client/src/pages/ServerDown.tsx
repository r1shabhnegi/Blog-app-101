import { HeartCrack } from 'lucide-react';

const ServerDown = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-2 text-6xl font-bold tracking-tight text-gray-700 bg-gray-300'>
      <HeartCrack className='size-20' />
      Server is down
    </div>
  );
};
export default ServerDown;
