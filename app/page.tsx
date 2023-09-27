"use client"
import { useState } from 'react';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadDuration, setUploadDuration] = useState<number | null>(null);  // Store upload duration
  const [loading, setLoading] = useState<boolean>(false);  // Store upload duration

  const handleFileChange = (event: any) => {
    // Convert the FileList to an array and set the state
    setFiles(Array.from(event.target.files));
  };


  const uploadFiles = async (zipFiles: boolean) => {
    setLoading(true);
    const startTime = Date.now();  // Timestamp before starting uploads

    const uploadPromises = files?.map(async (file, index) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name.replace(/\s/g, '')); formData.append('zipFiles', String(zipFiles));
      console.log(`File number ${index + 1} is being uploaded`)
      return fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
    });

    try {
      await Promise.all(uploadPromises);
      const endTime = Date.now();  // Timestamp after all uploads are finished
      setUploadDuration(endTime - startTime);  // Set the duration difference
    } catch (error) {
      console.log('error', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <input multiple type="file" onChange={handleFileChange} />
      <button onClick={() => uploadFiles(false)}>Upload to Azure</button>
      <button style={{ marginLeft: '2rem' }} onClick={() => uploadFiles(false)}>Zip and Upload to Azure</button>

      {uploadDuration && <p>Upload duration: {uploadDuration} milliseconds</p>}
      {loading && <p>Uploading...</p>}
    </div>
  );
}
