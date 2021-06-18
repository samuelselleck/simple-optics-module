import { derived, writable } from 'svelte/store';


export const svgCanvas = writable(null);
export const toLocalCoords = derived(svgCanvas, $svgCanvas => {

    return (el, pos) => {
        let point = $svgCanvas.createSVGPoint();
        point.x = pos.x
        point.y = pos.y
        return point.matrixTransform(el.getScreenCTM().inverse())
    }
})

export const selectedApparatus = writable(null)