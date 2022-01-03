
let vscodeApi;

export default function useAcquireVsCodeApi () {
    if (vscodeApi) {

    } else {
        vscodeApi = acquireVsCodeApi();
    }
    return vscodeApi;
}