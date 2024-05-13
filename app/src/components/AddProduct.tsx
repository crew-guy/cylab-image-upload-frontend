// src/components/AddProduct.tsx
import React, { useState } from 'react';
import { CameraComponent } from './CameraComponent';

export const AddProduct: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [startCamera, setStartCamera] = useState(false);

    return (
        <div>
            {!startCamera ? (
                <>
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
                    <button onClick={() => setStartCamera(true)}>Next</button>
                </>
            ) : (
                <CameraComponent productName={productName} />
            )}
        </div>
    );
};
