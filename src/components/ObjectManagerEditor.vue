<template>
    <el-card>
        <div class="p-0.5 flex flex-col items-center relative w-full gap-3">
            <object-manager-editor-item v-for="item in currentObjectManager!.objManagerItemArray"
                :curr-item="item"></object-manager-editor-item>
        </div>
        <template #footer>
            <!-- <div class="flex justify-center items-center"> -->
                <div class="flex gap-2 flex-wrap justify-center">
                    <el-button type="primary" @click="currentObjectManager!.addItem({
                        key: 'newKey',
                        type: 'Undefined',
                        value: undefined,
                    })">Add Item</el-button>
                    <el-button v-if="!isArrItem" type="primary" @click="handleDownloadBobj">To Bobj</el-button>
                    <el-button v-if="!isArrItem" type="primary" @click="handleDeserializerBobj">From Bobj</el-button>
                </div>
            <!-- </div> -->
        </template>
    </el-card>
</template>

<script setup lang="ts">
import ObjectManager, { ArrayObjectManager } from '../class/ObjectManager';
import { Serializer, Deserializer } from 'bobj'
import { downloadU8iArr } from '../utils/downloadU8iArr';
import { computed } from 'vue';
import selectFile from '../utils/selectFile';

const currentObjectManager = defineModel<ObjectManager>("currentObjectManager")

const isArrItem = computed(() => currentObjectManager.value! instanceof ArrayObjectManager)

const bobjSerializer = new Serializer()
const bobjDeserializer = new Deserializer()

const handleDownloadBobj = async () => {
    const bobjData = (await bobjSerializer.serialize(currentObjectManager.value!.generateObject()))!
    downloadU8iArr(bobjData, 'demo.bobj')
}

const handleDeserializerBobj = async () => {
    const file = await selectFile()
    if (!file) return
    const bobjData = await file.arrayBuffer()
    const obj = await bobjDeserializer.deserialize(new Uint8Array(bobjData))
    currentObjectManager.value!.objManagerItemArray = [...(new ObjectManager(obj)).objManagerItemArray]
    currentObjectManager.value!.objManagerItemArray.forEach(item => {
        item.parent = currentObjectManager.value!
    })
}

</script>

<style scoped></style>