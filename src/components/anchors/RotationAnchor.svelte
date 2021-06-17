<script>
    import PropertyAnchor from '../anchors/PropertyAnchor.svelte'

    export let property;
    export let distance;
    export let start = 0;

</script>

<g transform={`rotate(${-start}, 0, 0)`}>
<PropertyAnchor 
    bind:property={property}
    transform={`rotate(${property}, 0, 0) scale(${distance/200})`}
    behaviour={p => {
        let norm = Math.sqrt(p.x*p.x + p.y*p.y);
        let scaling = distance/norm;
        return {x: p.x*scaling, y: p.y*scaling}
    }}   
    forwardEval={p => 180/Math.PI*Math.atan2(p.y, p.x)}
    backEval={v => {
        let dist = distance;
        let radi = v*Math.PI/180;
        return {x: dist*Math.cos(radi), y: dist*Math.sin(radi)}
    }}
    svgIcon="rotation-marker"
/>
</g>