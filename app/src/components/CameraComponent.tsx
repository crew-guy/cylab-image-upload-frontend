// src/components/CameraComponent.tsx
import React, { useState, useRef } from 'react';
import { Camera } from "react-camera-pro";
import { useDispatch } from 'react-redux';
import { addProduct } from '../store/productSlice';

interface CameraComponentProps {
    productName: string;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({ productName }) => {
    const [images, setImages] = useState<string[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const cameraRef = useRef<any>(null);
    const dispatch = useDispatch();

    const handleCapture = () => {
        if (cameraRef.current) {
            const imageSrc = cameraRef.current.takePhoto();
            setImagePreviews((prevImages) => [...prevImages, imageSrc]);
            setImages((prevImages) => [...prevImages, imageSrc]);
        }
    };

    const uploadFiles = async () => {
        const uploadPromises = images.map(async (imageData, index) => {
            const formData = new FormData();
            formData.append('file', imageData);
            formData.append('filename', `product_${productName}_${index}.jpeg`);

            try {
                const response = await fetch('/api/upload', {
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
            dispatch(addProduct({ name: productName, imageUrls }));
        } catch (error: any) {
            console.error('Error while uploading files:', error.message);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                width: '100%',
                height: '100%',
            }}
        >
            <div className='camera-container'>
                <Camera errorMessages={
                    {
                        noCameraAccessible: 'No camera device accessible. Please connect a camera or use a different device.',
                        permissionDenied: 'Camera permission denied. Please grant permission to use the camera.'
                    }
                } ref={cameraRef} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {imagePreviews.map((src, index) => (
                    <img key={index} src={src} alt={`Capture ${index + 1}`} style={{ width: 100, height: 100, margin: 5 }} />
                ))}
            </div>
            <div className="button-bar">
                <button onClick={handleCapture} disabled={images.length >= 5}>Capture</button>
                <button onClick={uploadFiles} disabled={images.length < 5}>Done</button>
            </div>
        </div>
    );
};
