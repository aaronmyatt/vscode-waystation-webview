<script setup>
import { ref } from "vue";
import { matEdit } from "@quasar/extras/material-icons";
import useVscodeMessages from '../usable/useVscodeMessages';

const waystation = useVscodeMessages();
const showForm = ref(false);
</script>

<template>
    <div class="flex text-left q-pl-md text-weight-bolder">
        <h5 class="text-capitalize">{{ waystation.name }}</h5>
        <q-btn @click.stop="showForm = !showForm" size="12px" flat dense round :icon="matEdit" />
    </div>
    <div v-if="showForm">
        <q-input label="Name" v-model="waystation.name" filled />
        <q-input label="Body" v-model="waystation.body" filled type="textarea" />
    </div>
</template>