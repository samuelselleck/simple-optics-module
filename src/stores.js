import { derived, writable } from 'svelte/store';


export const svgCanvas = writable(null);
export const zoomgroup = writable(null);
export const scale = writable(1);
export const toLocalCoords = derived(svgCanvas, $svgCanvas => {

    return (el, pos) => {
        let point = $svgCanvas.createSVGPoint();
        point.x = pos.x
        point.y = pos.y
        let svgPoint = point.matrixTransform(el.getScreenCTM().inverse())
        return {x: svgPoint.x, y: svgPoint.y}
    }
})

export const selectedApparatus = writable(null)
export const idealMode = writable(true) //Ideal Lenses and Mirrors
export const snapToCenterline = writable(false)