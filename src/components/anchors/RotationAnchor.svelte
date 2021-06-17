<script>
    import { toDegrees, length, mult } from '../../utils/vectormath.js';
    import PropertyAnchor from '../anchors/PropertyAnchor.svelte'

    export let property;
    export let distance;
    export let start = 0;

</script>

<g transform={`rotate(${-toDegrees(start)}, 0, 0)`}>
<PropertyAnchor 
    bind:property={property}
    transform={`rotate(${toDegrees(property)}, 0, 0) scale(${distance/200})`}
    behaviour={p => {
        let len = length(p)
        let scaling = distance/len;
        return mult(p, scaling)
    }}   
    forwardEval={p => Math.atan2(p.y, p.x)}
    backEval={v => {
        let dist = distance;
        return {x: dist*Math.cos(v), y: dist*Math.sin(v)}
    }}
    svgIcon="rotation-marker"
/>
</g>