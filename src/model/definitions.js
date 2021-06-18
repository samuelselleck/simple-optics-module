import { mult, sub, add, unitVecFromAngle, rotate, project,  norm, length, crossSign, angleBetween } from '../utils/vectormath.js';

import Lens from '../components/opticsobjects/Lens.svelte';
import Beam from '../components/opticsobjects/Beam.svelte';
import Mirror from '../components/opticsobjects/Mirror.svelte';


export let definitions = new Map()
export let emmiters = []
export let manipulators = []

let idCounter = 0;

function addApparatus(type, definition, create) {
    definition.build = pos => ({type, properties: Object.assign(create(), {type, pos, angle: 0, id: idCounter++})})
    definitions.set(type, definition)

    //Any object with the rays property in some way emmits light
    if(definition.rays != undefined) {
        emmiters.push(type)
    }
    //Any object with the refracted property in some way bends light
    if(definition.refracted != undefined) {
        manipulators.push(type)
    }
}

addApparatus("beam", {
    component: Beam,

    rays: function(properties) {
        let rays = []
        let r = unitVecFromAngle(properties.angle)
        let t = mult({x: r.y, y: -r.x}, properties.height/2)

        for(let h = -1; h <= 1; h+= 0.2) {
            let p = add(mult(t, h), properties.pos)
            rays.push({p, r})
        }
        return rays;
    }

}, () => ({height: 250}))

addApparatus("lens", {
    component:Lens,

    refracted: function(properties, p, dir, segment) {
        let cross = crossSign(segment, dir)
        let normal = norm(rotate(segment, cross*Math.PI/2))
        let angleIn = angleBetween(dir, normal);

        let distVec = sub(properties.pos, p);
        let dist = length(distVec)*crossSign(distVec, dir);
        let angleOut = Math.atan(Math.tan(angleIn) - dist/properties.focal);
        let r = rotate(normal, angleOut);
        return {p, r}
    }
}, () => ({height: 300, focal: 500}))

addApparatus("mirror", {
    component: Mirror,

    refracted: function(properties, p, dir, segment) {
        let l = project(dir, segment)
        let d = sub(l, dir)
        let r = add(d, l)
        return {p, r}
    }

}, () => ({height: 400}))
