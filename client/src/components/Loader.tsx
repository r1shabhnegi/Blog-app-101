import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Loader2 className='text-gray-600 animate-spin size-28' />
    </div>
  );
};
export default Loader;
