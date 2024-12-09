import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { Outlet } from 'react-router-dom';
import TrailerModal from './trailer_components/TrailerModal.jsx';
import { useDispatch } from 'react-redux';
import CheckTokenExpiration from '../helpers/CheckTokenExpiration.jsx';

const BasicLayout = () => {
    CheckTokenExpiration();

    return (
            <div className='relative'>
            <Header />
            <div className="line-default block" style={{ borderBottom: '6px solid #f4f4f4', transform: 'matrix(1, 0, 0, -1, 0, 0)' }}></div>
            <Outlet />
            <Footer />
            <TrailerModal/>
        </div>
        
    );
};

export default BasicLayout;

