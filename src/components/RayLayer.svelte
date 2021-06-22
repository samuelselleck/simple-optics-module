<script>
    import { mult, sub, add, unitVecFromAngle, div, intersectionParameters, rotate, norm, length, crossSign, angleBetween } from '../utils/vectormath.js';
    import { definitions, emmiters, manipulators } from '../model/definitions.js'

    export let apparatus;

    let update;
    let down = () => update = true
    let up = () => update = false


    $: lights = apparatus.filter(o => emmiters.includes(o.type));
    $: objects = apparatus.filter(o => manipulators.includes(o.type));
    $: apparatus, calculateRayPaths();

    let pathString = "";

    function calculateRayPaths() {
        let path = []
        const maxRayBounces = 2;
        for(let i = 0; i < lights.length; i++) {
            let light = lights[i]
            let rays = definitions.get(light.type).rays(light.properties);

            for(let r = 0; r < rays.length; r++) {
                let ray = rays[r]
                path.push(`M ${ray.p.x},${ray.p.y}`)

                let j;
                for(j = 0; j < maxRayBounces; j++) {
                    let hit = calculateHit(ray)
                    if(hit != null) {
                        ray = hit;
                        path.push(`L ${ray.p.x}, ${ray.p.y}`)
                    } else {
                        break;
                    }
                }

                if(j < maxRayBounces) {
                    path.push(`l ${ray.r.x*10000}, ${ray.r.y*10000}`)
                }
            }
        }

        pathString = path.join(" ");
    }

    function calculateHit(ray) {

        let closest = {dist: Infinity};

        for(let i = 0; i < objects.length; i++) {
            let o = objects[i]
            let hit = definitions.get(o.type).hit(o.properties, ray)
            if (hit.dist < closest.dist && hit.dist > 1e-6) {
                closest = hit;
            }
        }

        if(closest.dist < Infinity) {
            return closest.refracted()
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

<svelte:window on:pointerdown={down} on:pointermove={moved} on:pointerup={up}/>

<path d={pathString}/>

<style>
    path {
        fill: none;
        stroke: red;
        stroke-width: 1;
        pointer-events: none
    }
</style>