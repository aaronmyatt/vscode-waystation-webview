import { onMounted, reactive, } from "vue";
import { debouncedWatch } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { matCheckCircle } from "@quasar/extras/material-icons";
import useAcquireVsCodeApi from "./useAcquireVsCodeApi";
import exampleWaysatation from "../example-waystation.json";


export default function useVscodeMessages () {
    const $q = useQuasar();
    let vscodeApi;
    let waystation = reactive({});
    if (import.meta.env.PROD) {
        vscodeApi = useAcquireVsCodeApi();
        waystation = Object.assign(waystation, vscodeApi.getState());
    } else {
        waystation = Object.assign(waystation, exampleWaysatation);
    }

    onMounted(() => {
        window.addEventListener('message', event => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
                case 'waystation:current':
                    {
                        vscodeApi?.setState(message.waystation);
                        Object.assign(waystation, message.waystation);
                        break;
                    }
                // case 'clearColors':
                //     {
                //         colors = [];
                //         updateColorList(colors);
                //         break;
                //     }

            }
        });
    })

    function updateWaystation (updatedWaystation) {
        vscodeApi?.setState(updatedWaystation);
        vscodeApi?.postMessage({
            type: "waystation:update",
            waystation: JSON.stringify(updatedWaystation)
        })
        if (import.meta.env.PROD) {
        } else {
            console.log({
                type: "waystation:update",
                waystation: JSON.stringify(updatedWaystation)
            })
        }
        $q.notify({ message: 'Synced with filesystem', color: "green", icon: matCheckCircle })
    }

    debouncedWatch(waystation, updateWaystation, { debounce: 500 })

    return waystation;
}