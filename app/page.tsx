"use client"
import { useState } from 'react';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadDuration, setUploadDuration] = useState<number | null>(null);  // Store upload duration

  const handleFileChange = (event: any) => {
    // Convert the FileList to an array and set the state
    setFiles(Array.from(event.target.files));
  };


  const uploadFiles = async () => {
    const startTime = Date.now();  // Timestamp before starting uploads

    const uploadPromises = files?.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name.replace(/\s/g, ''));

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
  };

  return (
    <div>
      <input multiple type="file" onChange={handleFileChange} />
      <button onClick={uploadFiles}>Upload to Azure</button>
      {uploadDuration && <p>Upload duration: {uploadDuration} milliseconds</p>}
    </div>
  );
}
