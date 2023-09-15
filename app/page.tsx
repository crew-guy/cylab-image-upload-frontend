"use client"
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async (file: any) => {
    // console.log('UPLOADING FILE NOW......', file.name)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name.replace(/\s/g, ''));

    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.log('error', error)
    }

  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={() => uploadFile(file as File)}>Upload to Azure</button>
    </div>
  );
}
