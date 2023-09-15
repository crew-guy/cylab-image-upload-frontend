"use client"
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };


  const uploadFile = async (file: any) => {
    console.log('UPLOADING FILE NOW......', file.name)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: file
    });

    if ((response as any).status === 200) {
      console.log(response)
    } else {
      console.error('Error uploading image:', response.statusText);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={() => uploadFile(file as File)}>Upload to Azure</button>
    </div>
  );
}
