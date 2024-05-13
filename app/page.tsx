"use client"
import { useState } from 'react';
import './page.module.css';
import { AddProduct } from './src/components/AddProduct';
import { Provider } from 'react-redux';
import { store } from './src/store';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploadDuration, setUploadDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles: File[] = Array.from(selectedFiles);
      setFiles([...files, ...newFiles]);
      // Preparing image previews for display in the gallery
      const newImages = newFiles.map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const uploadFiles = async (apiEndpointUrl: string) => {
    setLoading(true);
    const startTime = Date.now();

    const uploadPromises = files.map(async (file, index) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name.replace(/\s/g, ''));
      try {
        const response = await fetch(apiEndpointUrl, {
          method: 'POST',
          body: formData
        });
        return response.json();
      } catch (error: any) {
        console.log('error', error.message);
      }
    });

    try {
      const responses = await Promise.all(uploadPromises);
      console.log(`Files are uploaded`, responses);
      const endTime = Date.now();
      setUploadDuration(endTime - startTime);
    } catch (error: any) {
      console.log('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider store={store}>
      <div>
        <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px', backgroundColor: '#f0f0f0' }}>
          <img src="https://cylab-temp-testing-bucket.s3.amazonaws.com/images/ultron-logo.svg" alt="Logo" style={{ height: '50px' }} />
        </nav>
        <div className='app-container' style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 'calc(100vh - 60px)',
        }}>
          <AddProduct />
          {/* <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          {images.map((image, index) => (
            <img key={index} src={image} alt={`upload-preview-${index}`} style={{ width: '100px', height: '100px', margin: '5px' }} />
          ))}
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', background: '#54d6ff33', gap: '1rem', padding: '1rem', flexDirection: 'column' }}>
            <label htmlFor="file-upload">Upload File:</label>
            <input aria-label="Upload File:" multiple type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div style={{ display: 'flex', background: '#54d6ff33', gap: '1rem', padding: '1rem', flexDirection: 'column' }}>
            <label htmlFor="capture-file">Capture File:</label>
            <input aria-label="Capture File:" id="capture-file" type="file" accept="image/*;capture=camera" onChange={handleFileChange} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <button style={{ padding: '0.5rem' }} onClick={() => uploadFiles('/api/upload')}>Upload Serially to Azure</button>
          <button style={{ padding: '0.5rem' }} onClick={() => uploadFiles('/api/upload2')}>Upload Parallely to Azure</button>
        </div>
        {uploadDuration && <p>Upload duration: {uploadDuration} milliseconds</p>}
        {loading && <p>Uploading...</p>} */}
        </div>
      </div>
    </Provider>
  );
}





