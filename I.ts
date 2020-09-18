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

interface FileDestroyer {
    destroyFile(filePath: string): Promise<void>,
}

interface FileSaver {
    saveFile(buffer: Buffer, filename: string): Promise<string>,
}

interface FileReader {
    readFile(filePath: string): Promise<Buffer>,
}

function qualquer(leitorDeArquivo: FileReader) {
    return leitorDeArquivo.readFile('./teste.txt');
}



// nesse caso posso repassar a diante apenas o objeto que tem a
// necessidade de um comportamento específico sem que ele dependa de comportamentos não necessarios pra ele.


interface FileManager extends FileDestroyer, FileSaver, FileReader {
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

// No liskov principle essa classe poderia substituir sua classe mãe sem que o cliente saiba disso.
class LocalFileManagerV2 extends LocalFileManager {
    // finge que ta reutilizando algo...
    // constructor() {
    // }

    // alteração em alguns metodos etc...
    async readFile(filePath: string): Promise<Buffer> {
        return readFileAsync(filePath);
    }

    // alteração ...
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
    const fileManager = fileManagerFactory(TypeOfProvider.LOCAL);
    await fileManager.saveFile(Buffer.from("Testando"), 'test.txt');
    console.log((await fileManager.readFile('test.txt')).toString());
})()

// Dependency Inversion

class Batman {
    private fileManager : FileManager;

    constructor(fileManager: FileManager) {
        this.fileManager = fileManager;
    }
}

it(' ', () => {
    const b = new Batman(new LocalFileManager());
})
