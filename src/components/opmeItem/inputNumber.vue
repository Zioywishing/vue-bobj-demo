<template>
    <el-input v-model="numberString"></el-input>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const number = defineModel<number>("number")

const numberString = ref(number.value!.toString())

watch(numberString, (newValue, oldValue) => {
    if(Number.isNaN(Number(newValue))){
        numberString.value = oldValue 
    }else{
        number.value = Number(newValue)
        numberString.value = number.value.toString()
    }
})

</script>

<style scoped>

</style>