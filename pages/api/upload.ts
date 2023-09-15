import { NextApiRequest, NextApiResponse } from 'next';
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import Busboy from 'busboy';
import multiparty from "multiparty";

const AZURE_CONNECTION_STRING = process.env.NEXT_PUBLIC_AZURE_CONNECTION_STRING
const AZURE_SAS_TOKEN = process.env.NEXT_PUBLIC_AZURE_SAS_TOKEN
const AZURE_CONTAINER_NAME = process.env.NEXT_PUBLIC_AZURE_CONTAINER_NAME


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    let fileData: Buffer[] = [];
    let fileName: string | null = null;


    const busboy = Busboy({ headers: req.headers, limits: { fileSize: 10 * 1024 * 1024 } });

    busboy.on('file', function (fieldname: any, file: any, fname: any) {
        fileName = fname;
        file.on('data', (data: any) => {
            fileData.push(data);
        });
        file.on('error', (error: any) => {
            console.error('Error with file stream:', error);
        });
    });

    busboy.on('field', function (fieldname: any, val: any) {
        if (fieldname === 'filename') {
            fileName = val;
        }
    });

    busboy.on('finish', async function () {
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING as string);
        const sasToken = AZURE_SAS_TOKEN as string;
        const containerName = AZURE_CONTAINER_NAME as string;
        const containerUrl = blobServiceClient.getContainerClient(containerName).url + sasToken;
        const containerClient = new ContainerClient(containerUrl);
        const blobClient = containerClient.getBlobClient(fileName || "defaultName.pdf");
        const blockBlobClient = blobClient.getBlockBlobClient();
        const finalFileBuffer = Buffer.concat(fileData);
        try {
            const response = await blockBlobClient.upload(finalFileBuffer, finalFileBuffer.length);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return res.status(403).send(error);
        }
    });

    busboy.on('error', function (error) {
        console.error('Error parsing form:', error);
        res.status(500).send("Failed to parse form");
    });



    if (req.method === 'POST') {
        req.pipe(busboy).on('finish', busboy.end);
    }
}
export const config = {
    api: {
        bodyParser: false,
    },
};