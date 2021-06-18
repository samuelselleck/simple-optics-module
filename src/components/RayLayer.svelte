<script>
    import { mult, sub, add, unitVecFromAngle, div, intersectionParameters, rotate, norm, length, crossSign, angleBetween } from '../utils/vectormath.js';

    export let opticsObjects;
    export let lights;

    let update;

    let down = () => update = true
    let up = () => update = false


    $: opticsObjects, lights, calculateRayPaths();
    
    let pathString = "";

    function calculateRayPaths() {
        let path = []

        for(let i = 0; i < lights.length; i++) {
            let p = lights[i].properties
            let dir = unitVecFromAngle(p.angle)
            let t = mult({x: dir.y, y: -dir.x}, p.height/2)
            for(let h = -1; h <= 1; h+= 0.2) {
                let point = add(mult(t, h), p.pos)
                path.push(`M ${point.x},${point.y}`)

                let i;
                let ray = {p: point, r: dir}
                for(i = 0; i < 1000; i++) {
                    let hit = calculateHit(ray)
                    if(hit != null) {
                        ray = hit;
                        path.push(`L ${ray.p.x}, ${ray.p.y}`)
                    } else {
                        break;
                    }
                }

                if(i <1000) {
                    path.push(`l ${ray.r.x*10000}, ${ray.r.y*10000}`)
                }
            }
        }

        pathString = path.join(" ");
    }

    function calculateHit(ray) {

        let closest = Infinity
        let id = null;
        let segmentHit = null;

        for(let i = 0; i < opticsObjects.length; i++) {
            let o = opticsObjects[i].properties
            let segment = mult(unitVecFromAngle(o.angle + Math.PI/2), o.height)
            let origin = sub(o.pos, div(segment, 2))
            let params = intersectionParameters(ray.p, ray.r, origin, segment)

            if (params) {
                if(params.s >= 0&& params.s <= 1) {
                    if(params.t > 1e-6 && params.t < closest) {
                        closest = params.t
                        id = i;
                        segmentHit = segment;
                    }
                }
            }
        }

        if(closest < Infinity) {
            let o = opticsObjects[id].properties
            let p = add(ray.p, mult(ray.r, closest));
            let cross = crossSign(segmentHit, ray.r)
            let normal = norm(rotate(segmentHit, cross*Math.PI/2))
            let angleIn = angleBetween(ray.r, normal);

            let distVec = sub(o.pos, p);
            let dist = length(distVec)*crossSign(distVec, ray.r);
            let angleOut = Math.atan(Math.tan(angleIn) - dist/o.focal);
            let r = rotate(normal, angleOut);

            return {p, r}
        } else {
            return null;
        }
    }

    function moved() {
        if(update) {
            calculateRayPaths()
        }
    }

</script>

<svelte:window on:mousedown={down} on:mousemove={moved} on:mouseup={up}/>

<path d={pathString}/>

<style>
    path {
        fill: none;
        stroke: red;
        stroke-width: 1;
        pointer-events: none
    }
</style>