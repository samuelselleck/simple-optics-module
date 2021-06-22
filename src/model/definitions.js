import { mult, sub, add, unitVecFromAngle, rotate, project,
         norm, length, crossSign, angleBetween, div, intersectionParameters,
         decompose, angle, reflect, boundAngle} from '../utils/vectormath.js';

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

        for(let h = -1; h <= 1; h+= 10) {
            let p = add(mult(t, h), properties.pos)
            rays.push({p, r})
        }
        return rays;
    }

}, () => ({height: 250}))

addApparatus("lens", {
    component: Lens,
    hit: function(properties, ray) {
        let segment = mult(unitVecFromAngle(properties.angle + Math.PI/2), properties.height)
        let origin = sub(properties.pos, div(segment, 2))
        let params = intersectionParameters(ray.p, ray.r, origin, segment)

        if (params) {
            if(params.s >= 0&& params.s <= 1) {
                return {dist: params.t, refracted: () => {
                    let cross = crossSign(segment, ray.r)
                    let normal = norm(rotate(segment, cross*Math.PI/2))
                    let angleIn = angleBetween(ray.r, normal);
                    
                    let p = add(ray.p, mult(ray.r, params.t));
                    let distVec = sub(properties.pos, p);
                    let dist = length(distVec)*crossSign(distVec, ray.r);
                    let angleOut = Math.atan(Math.tan(angleIn) - dist/properties.focal);
                    let r = rotate(normal, angleOut);
                    return {p, r}
                }}
            }
        }
        return {dist: Infinity};
    }

}, () => ({height: 300, focal: 500}))

addApparatus("mirror", {
    component: Mirror,

    hit: function(properties, ray) {
        let normal = unitVecFromAngle(properties.angle)
        let radius = (properties.height*properties.height/4 + properties.curve*properties.curve)/properties.curve/2
        let center = add(properties.pos, mult(normal, properties.curve - radius))
        let dec = decompose(center, ray.p, ray.r)
        let lenToCenter = length(dec.normal)
        let hitAngle = (Math.PI/2 - Math.acos(lenToCenter/radius))*crossSign(ray.r, dec.normal)
        let hitAngleRelative =  hitAngle - angle(ray.r) + properties.angle

        let threshold = Math.PI - 2*Math.atan(properties.height/2/properties.curve)
        if(Math.abs(hitAngleRelative) < threshold) {
            let hitPos = add(center, mult(unitVecFromAngle(angle(ray.r) - hitAngle), radius))
            let dist = length(sub(ray.p, hitPos))
            return {dist, refracted: () => {
                let p = hitPos;
                let tangent = unitVecFromAngle(-hitAngle + Math.PI/2)
                let r = reflect(ray.r, tangent)
                return {p, r}
            }}
        }
        return {dist: Infinity};
    }

}, () => ({height: 400, curve: 100}))