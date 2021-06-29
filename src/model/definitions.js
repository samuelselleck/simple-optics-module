import { mult, sub, add, unitVecFromAngle, rotate,
         norm, length, crossSign, angleBetween, div, intersectionParameters,
         angle, reflect, boundAngle, dot} from '../utils/vectormath.js';

import { rayLineIntersect, rayBoxIntersect, idealRefraction, snellRefraction } from './intersections.js';

import Lens from '../components/opticsobjects/Lens.svelte';
import Beam from '../components/opticsobjects/Beam.svelte';
import Mirror from '../components/opticsobjects/Mirror.svelte';
import ConeLight from '../components/opticsobjects/ConeLight.svelte';
import Wall from '../components/opticsobjects/Wall.svelte'
import RectangleLens from '../components/opticsobjects/RectangleLens.svelte'

import { idealMode } from '../stores.js';
import { dev } from '$app/env'

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
    //Any object with the hit property in some way interacts with light
    if(definition.hit != undefined) {
        manipulators.push(type)
    }
}

addApparatus("beam", {
    component: Beam,

    rays: function(properties) {
        let rays = []
        let r = unitVecFromAngle(properties.angle)
        let t = mult({x: r.y, y: -r.x}, properties.height/2)

        let step = dev ? 0.1 : 0.1
        for(let h = -1; h <= 1; h+= step) {
            let p = add(mult(t, h), properties.pos)
            rays.push({p, r})
        }
        return rays;
    }

}, () => ({height: 250}))

addApparatus("cone light", {
    component: ConeLight,

    rays: function(properties) {
        let rays = []
        let n = unitVecFromAngle(properties.angle)

        let maxAngle = Math.atan(properties.height/properties.length/2)
        let step = maxAngle/5 - 0.0001
        for(let a = -maxAngle; a <= maxAngle; a+= step) {
            let p = add(mult(n, -properties.length), properties.pos)
            let r = rotate(n, a)
            rays.push({p, r})
        }
        return rays;
    }

}, () => ({height: 250, length: 100}))

addApparatus("lens", {
    component: Lens,
    hit: function(properties, ray) {
        let intersectionData = rayLineIntersect(ray, properties.pos, properties.angle, properties.height)
        return {
            dist: intersectionData.dist,
            refracted: () => idealRefraction(intersectionData, properties.focal, false, false)
        }
    }
}, () => ({height: 300, focal: 500}))

addApparatus("rectangle lens", {
    component: RectangleLens,
    hit: function(properties, ray) {
        let intersectionData = rayBoxIntersect(ray, properties.pos, properties.angle, properties.height, properties.width)
        return {
            dist: intersectionData.dist,
            refracted: () => snellRefraction(intersectionData, properties.n)
        }
    }
}, () => ({height: 300, width: 30, n: 1.5}))

addApparatus("wall", {
    component: Wall,
    hit: function(properties, ray) {
        let intersectionData = rayBoxIntersect(ray, properties.pos, properties.angle, properties.height, properties.width)
        return {
            dist: intersectionData.dist,
            refracted: () => ({p: add(ray.p, mult(ray.r, intersectionData.dist))})
        }
    }
}, () => ({height: 300, width: 30}))


addApparatus("mirror", {
    component: Mirror,
    hit: function(properties, ray) {

        let intersectionData = rayLineIntersect(ray, properties.pos, properties.angle, properties.height)
        return {
            dist: intersectionData.dist,
            refracted: () => idealRefraction(intersectionData, properties.curve, true, true)
        }
    },
}, () => ({height: 400, curve: 100}))
