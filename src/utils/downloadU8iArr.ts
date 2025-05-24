export const downloadU8iArr = (u8iArr: Uint8Array, name: string) => {
    const blob = new Blob([u8iArr]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
}