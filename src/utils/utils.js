import {definitions} from '../model/definitions';
import { base64StringToBlob, blobToBase64String } from 'blob-util';

export function isTouchDevice() {
return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

let query_replacements = [
    ["/", "_"],
    ["+", "-"],
    ["=", "."],
]

export function encodeApparatus(apparatus) {
    let types = Array.from(definitions.keys()).sort()
    let arr = [];
    for (let a of apparatus) {
        let props = a.properties
        arr.push(types.indexOf(a.type))
        arr.push(props.pos.x)
        arr.push(props.pos.y)
        arr.push(props.angle)
        let propList = definitions.get(a.type).properties
        for (let p of propList) {
            arr.push(props[p])
        }
    }
    let buffer = new Float32Array(arr)
    let blob = new Blob([buffer.buffer], {type: 'application/octet-stream'})
    return getBase64(blob)
}

export async function decodeApparatus(base64String) {
    let base64 = urlSafe(base64String, true)
    const blob = await (await fetch("data:application/octet-stream;base64," + base64)).blob();
    const buffer = await readFileAsync(blob)
    let arr = new Float32Array(buffer);
    let types = Array.from(definitions.keys()).sort()
    let i = 0
    let apparatus = []
    while(i < arr.length) {
        let typeIndex = arr[i]
        let definition = definitions.get(types[typeIndex])
        let obj = definition.build({x: arr[i + 1], y: arr[i + 2]})
        obj.properties.angle = arr[i + 3]
        i += 4;
        for(let p of definition.properties) {
            obj.properties[p] = arr[i]
            i++;
        }
        apparatus.push(obj)
    }
    return apparatus
}

function getBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(urlSafe(reader.result.split(",")[1],  false));
      reader.onerror = error => reject(error);
    });
}

function readFileAsync(file) {
    return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = e => {
                resolve(e.target.result);
            };
            reader.onerror = () => reject;
            reader.readAsArrayBuffer(file);
    })
}

function urlSafe(base64, reverse) {
    let url = base64;
    for (let r of query_replacements) {
        let char = r[reverse ? 1 : 0]
        let safe = r[reverse ? 0 : 1]
        url = url.split(char).join(safe)
    }
    return url;
}