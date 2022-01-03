


<script setup>
import { matEdit, matDelete, matMoreVert } from "@quasar/extras/material-icons";
import { onMounted, ref } from 'vue';
import useAcquireVsCodeApi from "./usable/useAcquireVsCodeApi";
import useVscodeMessages from './usable/useVscodeMessages';
import Sortable from 'sortablejs';

const waystation = useVscodeMessages();
const selectedMark = ref();
const showdialog = ref(false);

function deleteMark (mark) {
  waystation.marks = waystation.marks.filter(oldMark => mark.id !== oldMark.id);
}

function openDocument (mark) {
  if (import.meta.env.PROD) {
    const vscodeApi = useAcquireVsCodeApi();
    vscodeApi?.postMessage({
      type: "waystation:openDocument",
      mark: JSON.stringify(mark)
    });
  } else {
    console.log("Will open document for mark");
    console.log(mark);
  }
}

onMounted(() => {
  const el = document.getElementById('draggable');

  Sortable.create(el, {
    draggable: ".drag-item",
    onEnd: async function (/**Event*/evt) {
      function reorderMarks (marks, from, to) {
        // if (to < 0) return marks;
        // if (to > marks.length - 1) return marks;

        return marks.reduce(
          (newMarks, current, index, originalMarks) => {
            // reorder called to move the mark to the same position
            // essentially just rebuilds the array!
            if (from === to) {
              newMarks.push(current);
            }

            // bail early so that we don't write the mark to be moved
            // back to the same spot
            if (index === from) {
              return newMarks;
            }

            // keep rebuilding
            if (from < to) {
              newMarks.push(current);
            }

            // this is where the mark is to be repositioned
            if (index === to) {
              newMarks.push(originalMarks[from]);
            }

            // keep rebuilding
            if (from > to) {
              newMarks.push(current);
            }
            return newMarks;
          },
          [],
        );
      }

      waystation.marks = reorderMarks(waystation.marks, evt.oldIndex, evt.newIndex);
      if (import.meta.env.PROD) {
      } else {
        console.log(waystation.marks.map(mark => mark.name))
      }
      // evt.to;    // target list
      // evt.from;  // previous list
      // evt.oldIndex;  // element's old index within old parent
      // evt.newIndex;  // element's new index within new parent
      // evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
      // evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
      // evt.clone // the clone element
      // evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
    },
  })
})

</script>

<template>
  <div class="bg-grey-1 text-grey-10">
    <h5 class="text-capitalize">{{ waystation.name }}</h5>
    <q-list id="draggable">
      <div v-for="mark in waystation.marks" :key="mark.id" class="drag-item">
        <q-item clickable @click="openDocument(mark)">
          <q-item-section>
            <q-item-label>{{ mark.name }}</q-item-label>
            <pre>{{ mark.body }}</pre>
          </q-item-section>
          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn
                @click.stop="selectedMark = mark; showdialog = true"
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                :icon="matEdit"
              />
              <q-btn
                @click.stop="deleteMark(mark)"
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                :icon="matDelete"
              />
              <q-btn size="12px" flat dense round :icon="matMoreVert" />
            </div>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
      </div>
    </q-list>
    <q-dialog v-model="showdialog" full-width>
      <q-card>
        <q-card-section>
          <q-btn @click="selectedMark = {}; showdialog = !showdialog" label="Close"></q-btn>
          <q-input label="Name" v-model="selectedMark.name" filled />
          <q-input label="Body" v-model="selectedMark.body" filled type="textarea" />
          <q-input label="Path" v-model="selectedMark.path" filled />
          <q-input label="Line" v-model="selectedMark.line" filled type="number" />
          <q-input label="Column" v-model="selectedMark.column" filled type="number" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style>
#app {
  text-align: center;
}
</style>
