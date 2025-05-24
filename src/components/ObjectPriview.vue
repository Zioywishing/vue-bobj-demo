<template>
    <div>
        {{ props.currentObject }}
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    currentObject: {
        type: Object,
        required: true,
    }
});
</script>

<style scoped></style>