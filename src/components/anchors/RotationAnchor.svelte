<script>
    import { toDegrees, length, mult, norm, unitVecFromAngle } from '../../utils/vectormath.js';
    import PropertyAnchor from '../anchors/PropertyAnchor.svelte'

    export let property;
    export let distance;
    export let start = 0;

</script>

<g transform={`rotate(${-toDegrees(start)}, 0, 0)`}>
<PropertyAnchor 
    bind:property={property}
    transform={`rotate(${toDegrees(property)}, 0, 0) scale(${distance/200})`}
    behaviour={p => mult(norm(p), distance)}   
    forwardEval={p => Math.atan2(p.y, p.x)}
    backEval={v => mult(unitVecFromAngle(v), distance)}
    svgIcon="rotation-marker"
/>
</g>