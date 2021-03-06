import fs from 'fs';
import {promisify} from 'util';
import path from "path";

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);


enum TypeOfProvider {
    LOCAL,
    DRIVE,
    DROPBOX,
}

// Respeita o Open Closed, aberto para extensão fechado para modificação.
// Posso incluir novos frameworks como s3 etc sem modificar o código especifico de outros frameworks.
// por tanto posso extender as funcionalidades sem modificar o que ja existe.

interface FileManager {
    readFile(filePath: string): Promise<Buffer>,

    saveFile(buffer: Buffer, filename: string): Promise<string>,

    destroyFile(filePath: string): Promise<void>,
}

class LocalFileManager implements FileManager {
    constructor() {
    }

    async readFile(filePath: string): Promise<Buffer> {
        return readFileAsync(filePath);
    }

    async saveFile(buffer: Buffer, filename: string): Promise<string> {
        const file_path = path.join(__dirname, filename);
        await writeFileAsync(file_path, buffer);
        return file_path;
    }

    async destroyFile(filepath: string): Promise<void> {
        return unlinkAsync(filepath);
    }
}

class DriveFileManager implements FileManager {

    // constructor(driveApi) {
    //     driveApi = driveApi;
    // }


    readFile(filePath: string): Promise<Buffer> {
        return Promise.resolve(Buffer.from(""));
    }

    saveFile(buffer: Buffer, filename: string): Promise<string> {
        return Promise.resolve("");
    }

    destroyFile(filePath: string): Promise<void> {
        return Promise.resolve(undefined);
    }
}

// class DropboxFileManager implements FileManager {}; ...

// apresentar o factory...
function fileManagerFactory(typeOfProvider: TypeOfProvider): FileManager {
    switch (typeOfProvider) {
        case TypeOfProvider.DRIVE:
            return new DriveFileManager();
        // case TypeOfProvider.DROPBOX:
        case TypeOfProvider.LOCAL:
        default:
            return new LocalFileManager();
    }
}

(async () => {
    const fileManager: FileManager = fileManagerFactory(TypeOfProvider.LOCAL);
    await fileManager.saveFile(Buffer.from("Testando"), 'test.txt');
    console.log((await fileManager.readFile('test.txt')).toString());
})()

