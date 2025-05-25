<template>
    <el-card class="w-full min-w-2xs">
        <template #header>
            <div class="flex justify-between items-center gap-2">
                <div class="flex gap-2 flex-wrap">
                    <div class="flex items-center">
                        <el-input class="ml-2" v-model="props.currItem.key"
                            :disabled="isArrItem">
                            <template #prepend>KEY</template>
                        </el-input>
                    </div>
                    <div class="flex items-center">
                        <!-- Type -->
                        <el-select class="ml-2" v-model="currItem.type" placeholder="Undefined" style="width: 8rem;">
                            <el-option v-for="item in ObjManagerItemTypesArr" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                </div>
                <div>
                    <el-button type="danger" @click="props.currItem.delete()">Delete</el-button>
                </div>
            </div>
        </template>
        <el-input v-if="currItem.type === 'String'" v-model:model-value="currItem.value" :rows="2" type="textarea"
            placeholder="Empty"></el-input>
        <input-number v-if="currItem.type === 'Number'" v-model:number="currItem.value"></input-number>
        <div v-if="currItem.type === 'Boolean'" class="flex items-center gap-2">
            <el-switch v-model="props.currItem.value"></el-switch>
            <span> {{ props.currItem.value ? "True" : "False" }}</span>
        </div>
        <object-manager-editor v-if="['Object', 'Array'].includes(currItem.type)"
            :current-object-manager="currItem.value"></object-manager-editor>
        <input-u8i-arr v-if="currItem.type === 'Uint8Array'" v-model:u8i-arr="currItem.value" :file-name="currItem.key"
            @choose-file="file => currItem.key = file.name"></input-u8i-arr>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrayObjectManager } from '../class/ObjectManager';
import type ObjectManagerItem from '../class/ObjectManagerItem';
import ObjManagerItemTypesArr from '../utils/objManagerItemTypesArr';

const props = defineProps<{
    currItem: ObjectManagerItem,
}>()

const isArrItem = computed(() => props.currItem.parent instanceof ArrayObjectManager)

</script>

<style scoped></style>