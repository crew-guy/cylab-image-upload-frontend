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


  const uploadFiles = async () => {
    setLoading(true);
    const startTime = Date.now();  // Timestamp before starting uploads

    const uploadPromises = files?.map(async (file: any, index: any) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name.replace(/\s/g, ''));
      // console.log(`File number ${index + 1} is being uploaded`)
      try {
        const response = fetch('/api/upload2', {
          method: 'POST',
          body: formData
        });
        return response;
      } catch (error: any) {
        console.log('error', error.message);
      }
    });

    try {
      await Promise.all(uploadPromises);
      console.log(`File is uploaded`)
      const endTime = Date.now();  // Timestamp after all uploads are finished
      setUploadDuration(endTime - startTime);  // Set the duration difference
    } catch (error: any) {
      console.log('error', error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <input multiple type="file" onChange={handleFileChange} />
      <button onClick={uploadFiles}>Upload to Azure</button>
      {uploadDuration && <p>Upload duration: {uploadDuration} milliseconds</p>}
      {loading && <p>Uploading...</p>}
    </div>
  );
}
