<template>
    <div class="flex items-center gap-2 flex-wrap">
        <div>
            {{ description }}
        </div>
        <el-button @click="handleParseLocalFile">
            Choose File
        </el-button>
        <el-button @click="handleDownloadData">
            Save File
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import selectFile from '../../utils/selectFile';
import { downloadU8iArr } from '../../utils/downloadU8iArr';

const props = defineProps<{
    fileName?: string,
}>()

const emit = defineEmits<{
    (e: "chooseFile", file: File): void; 
}>()

const u8iArr = defineModel<Uint8Array>("u8iArr")

const description = computed(() => {
    const length = u8iArr.value!.length;
    return `[${u8iArr.value!.subarray(0, 10)!.join(", ")}${u8iArr.value!.length > 10 ? "..." : ""}] Uint8Array(${length})`;
})

const handleParseLocalFile = async () => {
    const file = await selectFile();
    if (file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
            const arr = new Uint8Array(e.target!.result as ArrayBuffer);
            u8iArr.value = arr;
        }
        emit("chooseFile", file);
    }
}

const handleDownloadData = () => {
    downloadU8iArr(u8iArr.value!, props.fileName || "data");
}
</script>

<style scoped></style>