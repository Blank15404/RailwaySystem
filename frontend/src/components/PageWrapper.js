// src/components/PageWrapper.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import background from '../images/background.jpg';

const PageWrapper = ({ children }) => {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundImage: `url(${background})`,backgroundPosition: 'center',backgroundAttachment: 'fixed',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}}>
            <div className="container-fluid">
                {children}
            </div>
        </div>
    );
};

export default PageWrapper;
