import fs from 'fs';
import {promisify} from 'util';
import path from "path";

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

enum TypeOfProvider {
    LOCAL,
    DRIVE,
    DROPBOX,
}

// Single Responsability Principle
// Principio da responsabilidade única ou também pode ser conhecido como principio de um único motivo para mudar.

// aplicando S ao exemplo anterior



// Fere os principios O L I D
class FileManager {
    constructor() {
    }

    async readFile(typeOfProvider: TypeOfProvider, filePath: string): Promise<Buffer> {
        switch (typeOfProvider) {
            case TypeOfProvider.LOCAL:
                return readFileAsync(filePath);
            case TypeOfProvider.DRIVE:
                // código que salva no dropbox aqui
                return Buffer.from("do drive...");
            case TypeOfProvider.DROPBOX:
                // código que salva no dropbox aqui
                return Buffer.from("do dropbox...");
        }
    }

    async saveFile(typeOfProvider: TypeOfProvider, buffer: Buffer, filename: string): Promise<string> {
        switch (typeOfProvider) {
            case TypeOfProvider.LOCAL:
                const file_path = path.join(__dirname, filename);
                await writeFileAsync(file_path, buffer);
                return file_path;
            case TypeOfProvider.DRIVE:
                // código que salva no dropbox aqui
                return ""
            case TypeOfProvider.DROPBOX:
                // código que salva no dropbox aqui
                return "";
        }
    }
}


(async () => {
    const fileManager = new FileManager();
    await fileManager.saveFile(TypeOfProvider.LOCAL, Buffer.from("Testando"), 'test.txt');
    console.log((await fileManager.readFile(TypeOfProvider.LOCAL, 'test.txt')).toString());
})()
