<script>
    import { mult, norm, project, dot } from '../../utils/vectormath.js';
    import PropertyAnchor from '../anchors/PropertyAnchor.svelte'

    export let property;
    export let dir;
    export let scale = 1;
    export let forwardEvalOverride;

    dir = norm(dir);
</script>

<PropertyAnchor 
    bind:property={property}
    behaviour={p => project(p, dir)}
    forwardEval={p => (forwardEvalOverride ?? (v => v))(dot(p, dir)/scale)}
    backEval={v => mult(dir, v*scale)}
>  
    <use xlink:href="#anchor-marker"/>
</PropertyAnchor>