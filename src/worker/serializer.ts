import { Serializer } from 'bobj'

const serializer = new Serializer()

self.onmessage = async (e) => {
    const obj = e.data
    const result = await serializer.serialize(obj)
    self.postMessage(result)
}