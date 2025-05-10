import { FaWater } from 'react-icons/fa';
import '../styles/App.css';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="spinner"></div>
        <h2 className="text-xl font-bold text-gray-700 mt-3 mb-2">Loading...</h2>
        <p className="text-gray-500">Please wait while we retrieve the data</p>
      </div>
    </div>
  );
};

export default Loader;