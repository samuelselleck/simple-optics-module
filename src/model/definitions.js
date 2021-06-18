import { mult, sub, add, unitVecFromAngle, rotate, project,  norm, length, crossSign, angleBetween } from '../utils/vectormath.js';

export let lightModels = new Map()

lightModels.set("beam", {
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
})

export let objectModels = new Map()

objectModels.set("lens", {
    outRay: function(properties, p, dir, segment) {
        let cross = crossSign(segment, dir)
        let normal = norm(rotate(segment, cross*Math.PI/2))
        let angleIn = angleBetween(dir, normal);

        let distVec = sub(properties.pos, p);
        let dist = length(distVec)*crossSign(distVec, dir);
        let angleOut = Math.atan(Math.tan(angleIn) - dist/properties.focal);
        let r = rotate(normal, angleOut);
        return {p, r}
    }
})

objectModels.set("mirror", {
    outRay: function(properties, p, dir, segment) {
        let l = project(dir, segment)
        let d = sub(l, dir)
        let r = add(d, l)
        return {p, r}
    }
})
