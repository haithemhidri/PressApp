import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Sidebar from './components/sideBar';
import { useSelector } from 'react-redux';
import './styles/styles.css';


const App = () => {
  
  const { userInfo } = useSelector((state) => state.auth);
  
  const mainContentStyle = {
    marginLeft: userInfo ? '250px' : '0', 
    paddingTop: '60px', 
    transition: 'margin-left 0.3s ease', 
  };
  
  return (
    <>
      <Header />
      {userInfo && <Sidebar />} {/* Render Sidebar only if authenticated */}
      <div style={mainContentStyle}>
        <ToastContainer />
        <Outlet />
      </div>
    </>
  );
};

export default App;