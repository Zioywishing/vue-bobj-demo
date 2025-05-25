<template>
    <el-card>
        <div class="p-0.5 flex flex-col items-center relative w-full gap-3">
            <object-manager-editor-item v-for="item in currentObjectManager!.objManagerItemArray"
                :curr-item="item"></object-manager-editor-item>
        </div>
        <template #footer>
            <div class="flex gap-2 flex-wrap justify-center">
                <el-button type="primary" @click="currentObjectManager!.addItem({
                    key: 'newKey',
                    type: 'Undefined',
                    value: undefined,
                })">Add Item</el-button>
                <el-button v-if="!isArrItem" type="primary" @click="handleDownloadBobj"
                    :disabled="workerBusyCondition.serializerWorker"> {{ workerBusyCondition.serializerWorker ? "Busy" :
                    "To Bobj" }} </el-button>
                <el-button v-if="!isArrItem" type="primary" @click="handleDeserializerBobj">{{
                    workerBusyCondition.deserializerWorker ? "Busy" : "From Bobj" }}</el-button>
            </div>
        </template>
    </el-card>
</template>

<script setup lang="ts">
import ObjectManager, { ArrayObjectManager } from '../class/ObjectManager';
import SerializerWorker from '../worker/serializer?worker';
import DesrializerWorker from '../worker/deserializer?worker';
import { computed, reactive } from 'vue';
import selectFile from '../utils/selectFile';
import { downloadU8iArr } from '../utils/downloadU8iArr';

const currentObjectManager = defineModel<ObjectManager>("currentObjectManager")

const isArrItem = computed(() => currentObjectManager.value! instanceof ArrayObjectManager)

const workerBusyCondition = reactive({
    serializerWorker: false,
    deserializerWorker: false,
})

const handleDownloadBobj = async () => {
    workerBusyCondition.serializerWorker = true
    const serializerWorker = new SerializerWorker()
    try {
        const resultPromise = new Promise<Uint8Array>((resolve, reject) => {
            serializerWorker.onmessage = (e) => {
                resolve(e.data)
            }
            serializerWorker.onerror = (e) => {
                reject(e)
            }
        })
        serializerWorker.postMessage(currentObjectManager.value!.generateObject())
        const bobjData = await resultPromise as Uint8Array
        downloadU8iArr(bobjData, 'demo.bobj')
    } catch (e) {
        console.error(e)
    }
    serializerWorker.terminate()
    workerBusyCondition.serializerWorker = false
}

const handleDeserializerBobj = async () => {

    workerBusyCondition.deserializerWorker = true
    const deserializerWorker = new DesrializerWorker()
    try {
        const file = await selectFile()
        if (!file) return
        const bobjData = await file.arrayBuffer()
        const resultPromise = new Promise<Object>((resolve, reject) => {
            deserializerWorker.onmessage = (e) => {
                resolve(e.data)
            }
            deserializerWorker.onerror = (e) => {
                reject(e)
            }
        })
        deserializerWorker.postMessage(bobjData, [bobjData])
        currentObjectManager.value!.objManagerItemArray = [...(new ObjectManager(await resultPromise)).objManagerItemArray]
        currentObjectManager.value!.objManagerItemArray.forEach(item => {
            item.parent = currentObjectManager.value!
        })
    } catch (e) {
        console.error(e)
    }
    workerBusyCondition.deserializerWorker = false
}

</script>

<style scoped></style>