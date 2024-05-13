// src/components/CameraComponent.tsx
import React, { useState, useRef } from 'react';
import { Camera } from "react-camera-pro";
import { useDispatch } from 'react-redux';
import { addProduct } from '../../store/productSlice';
import { Button } from 'antd-mobile';
import { DeleteOutlined } from '@ant-design/icons';

interface CameraComponentProps {
    productName: string;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({ productName }) => {
    const [images, setImages] = useState<{ [key: string]: string }>({});
    const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});
    const [currentView, setCurrentView] = useState(0);
    const views = ['front', 'back', 'barcode', 'top'];
    const cameraRef = useRef<any>(null);
    const dispatch = useDispatch();

    const handleCapture = () => {
        if (cameraRef.current) {
            const imageSrc = cameraRef.current.takePhoto();
            const view = views[currentView];
            setImagePreviews(prev => ({ ...prev, [view]: imageSrc }));
            setImages(prev => ({ ...prev, [view]: imageSrc }));
            if (currentView < views.length - 1) {
                setCurrentView(currentView + 1);
            } else {
                setCurrentView(0); // Resets to the first view, adjust based on your flow needs
            }
        }
    };

    const handleRemoveImage = (view: string) => {
        const updatedImages = { ...images };
        const updatedPreviews = { ...imagePreviews };
        delete updatedImages[view];
        delete updatedPreviews[view];
        setImages(updatedImages);
        setImagePreviews(updatedPreviews);
        setCurrentView(views.indexOf(view)); // Set current view to retake photo
    };

    const uploadFiles = async () => {
        const uploadPromises = Object.entries(images).map(async ([key, imageData]) => {
            const formData = new FormData();
            formData.append('file', imageData);
            formData.append('filename', `product_${productName}_${key}.jpeg`);

            try {
                const response = await fetch('/api/upload2', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                return data.url; // Assuming the response contains the URL of the uploaded image
            } catch (error: any) {
                console.error('Upload error:', error.message);
                return '';
            }
        });

        try {
            const imageUrls = await Promise.all(uploadPromises);
            dispatch(addProduct({ name: productName, imageUrls: imageUrls }));
        } catch (error: any) {
            console.error('Error while uploading files:', error.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className='camera-container'>
                <Camera errorMessages={{
                    noCameraAccessible: 'No camera device accessible. Please connect a camera or use a different device.',
                    permissionDenied: 'Camera permission denied. Please grant permission to use the camera.'
                }} ref={cameraRef} />
                <div className='camera-view-container' >
                    Capture {views[currentView]}
                </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
                {Object.entries(imagePreviews).map(([key, src]) => (
                    <div key={key} style={{ margin: 10 }}>
                        <img src={src} alt={`${key} view`} style={{ width: 100, height: 100 }} />
                        <Button
                            // icon={<DeleteOutlined />}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                position: 'relative',
                                top: -80,
                                right: 20,
                                cursor: 'pointer',
                                zIndex: 5,
                            }}
                            onClick={() => handleRemoveImage(key)}
                        >X</Button>
                    </div>
                ))}
            </div>
            <div className='button-bar'>
                <button onClick={handleCapture} disabled={Object.keys(images).length >= views.length}>Capture {views[currentView]}</button>
                <button onClick={uploadFiles} disabled={Object.keys(images).length < views.length}>Done</button>
            </div>
        </div>
    );
};
