"use client"
import { useState } from 'react';
import './page.module.css'

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadDuration, setUploadDuration] = useState<number | null>(null);  // Store upload duration
  const [loading, setLoading] = useState<boolean>(false);  // Store upload duration

  const handleFileChange = (event: any) => {
    // Convert the FileList to an array and set the state
    setFiles(Array.from(event.target.files));
  };


  const uploadFiles = async (apiEndpointUrl: string) => {
    setLoading(true);
    const startTime = Date.now();  // Timestamp before starting uploads

    const uploadPromises = files?.map(async (file: any, index: any) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name.replace(/\s/g, ''));
      // console.log(`File number ${index + 1} is being uploaded`)
      try {
        const response = await fetch(apiEndpointUrl, {
          method: 'POST',
          body: formData
        });
        return response.json();  // Ensure you are returning a promise here
      } catch (error: any) {
        console.log('error', error.message);
      }
    });

    try {
      const responses = await Promise.all(uploadPromises);  // Wait for all promises to resolve
      console.log(`Files are uploaded`, responses);
      const endTime = Date.now();  // Timestamp after all uploads are finished
      setUploadDuration(endTime - startTime);  // Set the duration difference
    } catch (error: any) {
      console.log('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='app-container' style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: '100vh',
    }}>
      <h2>Image Uploader</h2>
      <input multiple type="file" onChange={handleFileChange} />
      <button
        style={{
          padding: '10px',
          fontSize: '1rem'
        }}
        onClick={() => uploadFiles('/api/upload')}>Upload Serially to Azure</button>
      <button
        style={{
          padding: '10px',
          fontSize: '1rem'
        }}
        onClick={() => uploadFiles('/api/upload2')}>Upload Parallely to Azure</button>
      {uploadDuration && <p>Upload duration: {uploadDuration} milliseconds</p>}
      {loading && <p>Uploading...</p>}
    </div>
  );
}
