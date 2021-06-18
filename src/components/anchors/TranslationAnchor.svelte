<script>
    import { length, mult, project } from '../../utils/vectormath.js';
    import PropertyAnchor from '../anchors/PropertyAnchor.svelte'

    export let property;
    export let dir;
    export let scale = 1;

    let len = Math.sqrt(dir.y*dir.y + dir.x*dir.x)
    dir = {x: dir.x/len, y: dir.y/len}
</script>

<PropertyAnchor 
    bind:property={property}
    behaviour={p => ({x: dir.x*(p.x*dir.x + p.y*dir.y), y: dir.y*(p.x*dir.x + p.y*dir.y)})}
    forwardEval={p => length(p)/scale}
    backEval={v => mult(dir, v*scale)}
/>