<script>
    import { mult, norm, project, dot } from '../../utils/vectormath.js';
    import PropertyAnchor from '../anchors/PropertyAnchor.svelte'

    export let property;
    export let dir;
    export let scale = 1;
    export let forwardEvalOverride = v => Math.max(1, v);

    dir = norm(dir);
</script>

<PropertyAnchor 
    bind:property={property}
    behaviour={p => project(p, dir)}
    forwardEval={p => forwardEvalOverride(dot(p, dir)/scale)}
    backEval={v => mult(dir, v*scale)}
>  
    <use xlink:href="#anchor-marker"/>
</PropertyAnchor>