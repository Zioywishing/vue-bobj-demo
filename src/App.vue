<script setup lang="ts">
import { ref } from 'vue';
import ObjectManager from './class/ObjectManager';

const rootObjectManager = ref(new ObjectManager({
  "name": "MiaoSpring",
}));
</script>

<template>
  <div>
    <object-manager-editor v-model:current-object-manager="(rootObjectManager as ObjectManager)"></object-manager-editor>
  </div>
</template>

<style scoped></style>
