import { mult, sub, add, unitVecFromAngle, rotate, project,
         norm, length, crossSign, angleBetween, div, intersectionParameters,
         decompose, angle, reflect, boundAngle, dot} from '../utils/vectormath.js';

import Lens from '../components/opticsobjects/Lens.svelte';
import Beam from '../components/opticsobjects/Beam.svelte';
import Mirror from '../components/opticsobjects/Mirror.svelte';

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
        let center = add(properties.pos, mult(normal, properties.curve - radius));
        
        let d = ray.r;
        let f = sub(ray.p, center);

        let a = dot(d, d);
        let b = 2*dot(f, d);
        let c = dot(f, f) - radius*radius;

        let discriminant = b*b - 4*a*c;

        if(discriminant < 0) {
            return {dist: Infinity};
        }
        discriminant = Math.sqrt(discriminant);

        let t1 = (-b - discriminant)/(2*a); // t1 > 0 ==> ray starts before circle
        let t2 = (-b + discriminant)/(2*a); // t2 > 0 ==> ray is not past circle

        function withinArc(p) {
            let radVec = sub(p, center);
            let ang = angle(radVec);
            let aDiff = boundAngle(ang - properties.angle);
            let arcAngle = Math.atan(properties.height/2/(radius - properties.curve));
            return aDiff < arcAngle && aDiff > -arcAngle;
        }

        let ret = null;
        let p1 = add(ray.p, mult(ray.r, t1));
        let p2 = add(ray.p, mult(ray.r, t2));
        if (t1 > 1e-6 && withinArc(p1)) {
            ret = { p: p1, dist: t1}
        } else if (withinArc(p2)) {
            ret = { p: p2, dist: t2}
        }

        if (ret != null) {
            return {dist: ret.dist, refracted: () => {
                let tangent = rotate(sub(ret.p, center), Math.PI/2)
                let r = reflect(ray.r, tangent)
                return {p: ret.p, r}
            }}
        }

        return {dist: Infinity}
    }

}, () => ({height: 400, curve: 100}))
