import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: any, res: any) {
    const file = req.body;
    if (req.method !== 'POST') {
        return res.status(405).end();
    }
    const blobServiceClient = BlobServiceClient.fromConnectionString(`BlobEndpoint=https://ankitcylab.blob.core.windows.net/;QueueEndpoint=https://ankitcylab.queue.core.windows.net/;FileEndpoint=https://ankitcylab.file.core.windows.net/;TableEndpoint=https://ankitcylab.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-09-24T22:55:18Z&st=2023-09-14T14:55:18Z&sip=0.0.0.0-255.255.255.255&spr=https&sig=xRKQUSxBdHryiT%2BFUKiHnffX%2B8h0r9pXfHLZOmFioyc%3D`);
    const sasToken = "?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-09-24T22:55:18Z&st=2023-09-14T14:55:18Z&sip=0.0.0.0&spr=https,http&sig=a7J3wEC0%2F8WRiPdxJLAiSLiaUGt2EXLWQH4Zvncir4M%3D"
    const containerName = 'ankitcylabcontainer';
    const containerUrl = blobServiceClient.getContainerClient(containerName).url + sasToken;
    const containerClient = new ContainerClient(containerUrl);
    const blobClient = containerClient.getBlobClient(uuidv4());
    const blockBlobClient = blobClient.getBlockBlobClient();
    try {
        const response = await blockBlobClient.upload(req.body, req.body.length);
        // const result = await blockBlobClient.uploadBrowserData(file, {
        //     blockSize: 4 * 1024 * 1024,
        //     concurrency: 20,
        //     onProgress: ev => console.log(ev)
        // });
        // console.log(result)
        console.log(`Upload of file '${file.name}' completed`);
        return res.status(200).send("Upload successful!");
    } catch (error) {
        console.log(error)
        return res.status(403).send(error);
    }
}