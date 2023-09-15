import { NextApiRequest, NextApiResponse } from 'next';
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from 'uuid';
import Busboy from 'busboy';

const AZURE_CONNECTION_STRING = "BlobEndpoint=https://ankitcylab2.blob.core.windows.net/;QueueEndpoint=https://ankitcylab2.queue.core.windows.net/;FileEndpoint=https://ankitcylab2.file.core.windows.net/;TableEndpoint=https://ankitcylab2.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-09-25T09:45:52Z&st=2023-09-15T01:45:52Z&sip=0.0.0.0-255.255.255.255&spr=https,http&sig=z2XowQz7rjOfBrTjJtLt%2BEPGnTHdDp%2F%2B1kLVOnrgAXU%3D"
const AZURE_SAS_TOKEN = "?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-09-25T09:45:52Z&st=2023-09-15T01:45:52Z&sip=0.0.0.0-255.255.255.255&spr=https,http&sig=z2XowQz7rjOfBrTjJtLt%2BEPGnTHdDp%2F%2B1kLVOnrgAXU%3D"
const AZURE_CONTAINER_NAME = "arsanghvcylab"

export default async function handler(req: any, res: any) {
    const file = req.body;
    let fileName = "req.pdf";
    // const busboy = new Busboy({ headers: req.headers });
    if (req.method !== 'POST') {
        return res.status(405).end();
    }
    // let fileData: Buffer[] = []

    // busboy.on('file', function(fieldname:any, file:any, fname:any) {
    //   fileName = fname;
    //   file.on('data', (data:any) => {
    //     fileData.push(data);
    //   });
    // });
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING);
    const sasToken = AZURE_SAS_TOKEN
    const containerName = AZURE_CONTAINER_NAME
    const containerUrl = blobServiceClient.getContainerClient(containerName).url + sasToken;
    const containerClient = new ContainerClient(containerUrl);
    const blobClient = containerClient.getBlobClient(fileName);
    const blockBlobClient = blobClient.getBlockBlobClient();
    try {
        const response = await blockBlobClient.upload(req.body, req.body.length);
        console.log(response);
        console.log(`Upload of file '${response.clientRequestId}' completed`);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(403).send(error);
    }
}