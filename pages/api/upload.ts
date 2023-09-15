import { NextApiRequest, NextApiResponse } from 'next';
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import Busboy from 'busboy';

const AZURE_CONNECTION_STRING = "=hqt&srt=sco&sp=rwdlacupiytfx&se=2023-09-25T09:45:52Z&st=2023-09-15T01:45:52Z&sip=0.0.0.0-255.255.255.255&spr=https,http&sig=z2XowQz7rjOfBrTjJtLt%2BEPGnTHdDp%2F%2B1kLVOnrgAXU%3D"
const AZURE_SAS_TOKEN = "svF%2B1kLVOnrgAXU%3D"
const AZURE_CONTAINER_NAME = ""

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
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING);
        const sasToken = AZURE_SAS_TOKEN;
        const containerName = AZURE_CONTAINER_NAME;
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