import { Deserializer } from 'bobj'

const deserializer = new Deserializer()

self.onmessage = async (e) => {
    const u8iArr = new Uint8Array(e.data)
    const result = await deserializer.deserialize(u8iArr)
    self.postMessage(result)
}