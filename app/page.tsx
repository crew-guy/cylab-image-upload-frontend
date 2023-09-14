"use client"
// import Image from 'next/image'
// import styles from './page.module.css'
// import { BlobServiceClient } from '@azure/storage-blob';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };


  const uploadImage = async (file: File) => {
    console.log('UPLOADING IMAGE NOW......', file.name)
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: file
    });

    if ((response as any).statusCode === 200) {
      console.log('Upload successful');
    } else {
      console.error('Error uploading image:', response.statusText);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={() => uploadImage(file as File)}>Upload to Azure</button>
    </div>
  );
}
