<script>
    import { length, mult, norm, project } from '../../utils/vectormath.js';
    import PropertyAnchor from '../anchors/PropertyAnchor.svelte'

    export let property;
    export let dir;
    export let scale = 1;

    dir = norm(dir);
</script>

<PropertyAnchor 
    bind:property={property}
    behaviour={p => project(p, dir)}
    forwardEval={p => length(p)/scale}
    backEval={v => mult(dir, v*scale)}
/>