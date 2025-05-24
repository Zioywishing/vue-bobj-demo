export default function selectFile(accept?: string): Promise<File | null> {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept || "*"
        input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            const files = target.files;
            if (!files || files.length === 0) {
                resolve(null);
                return;
            }
            resolve(files[0]);
        };
        input.onabort = () => {
            reject(new Error("File selection was aborted.")); 
        }
        input.onerror = (e) => {
            reject(e); 
        }
        input.oncancel = () => {
            reject(new Error("File selection was canceled.")); 
        }
        input.click();
    })
}