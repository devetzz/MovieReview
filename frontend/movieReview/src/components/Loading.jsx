import React from 'react';
import { PacmanLoader } from 'react-spinners';

const override = {
    span: '20px',
    margin : '0 auto',
    marginTop:'220px',
    textAlign : 'start',
    color : '#fff',
    size : '20'
};

const Loading = () => {
    return (
        <div>
            <div className="text-center">
                <PacmanLoader
                    color="#fff504"
                    loading
                    cssOverride={override}
                    margin={2}
                    size={25}
                    speedMultiplier={1}
                />
                <h3>Loading............</h3>
            </div>
        </div>
    );
};

export default Loading;