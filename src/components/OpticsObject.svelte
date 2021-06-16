<script>
    import { toLocalCoords } from '../stores.js'
    import PropertyAnchor from './PropertyAnchor.svelte'

    export let properties = {}

    let moving = false;
    let anchor = {x: 0, y: 0}

    function down(event) {
        moving = true;
        anchor = {x: properties.pos.x - event.clientX, y: properties.pos.y - event.clientY}
    }

    function moved(event) {
        if(moving) {
            properties.pos.x = event.clientX + anchor.x;
            properties.pos.y = event.clientY + anchor.y;
        }
    }

    function up(event) {
        moving = false;
    }

    $: path = `
        M0,${properties.height/2}
        a${properties.focal},${properties.focal} 0 0,0 0,-${properties.height}
        a${properties.focal},${properties.focal} 0 0,0 0,${properties.height}
    `
    $: objectTranslation = `translate(${properties.pos.x},${properties.pos.y})`;
    $: objectRotation = `rotate(${properties.angle}, 0, 0)`;

</script>

<svelte:window on:mousemove={moved} on:mouseup={up}/>

<g transform={objectTranslation}>
    <g transform={objectRotation}>
        <path on:mousedown={down} d={path} fill="url(#glass)"/>
        <!--Focal Length-->
        <PropertyAnchor 
            bind:property={properties.focal}
            behaviour={p => ({x: p.x, y: 0})}
        />
        <PropertyAnchor 
            bind:property={properties.focal}
            behaviour={p => ({x: p.x, y: 0})}
            forwardEval={p => -p.x}
            backEval={v => ({x: -v, y: 0})}
        />

        <!--Height-->
        <PropertyAnchor 
            bind:property={properties.height}
            behaviour={p => ({x: 0, y: p.y})}
            forwardEval={p => p.y*2}
            backEval={v => ({x: 0, y: v/2})}
        />
        <PropertyAnchor 
            bind:property={properties.height}
            behaviour={p => ({x: 0, y: p.y})}
            forwardEval={p => -p.y*2}
            backEval={v => ({x: 0, y: -v/2})}
        />

    </g>
    <PropertyAnchor 
        bind:property={properties.angle}
        behaviour={p => {
            let dist = properties.height/2 + 30;
            let norm = Math.sqrt(p.x*p.x + p.y*p.y);
            let scaling = dist/norm;
            return {x: p.x*scaling, y: p.y*scaling}
        }}   
        forwardEval={p => 180/Math.PI*Math.atan2(p.y, p.x) - 90}
        backEval={v => {
            let dist = properties.height/2 + 30;
            let radi = v*Math.PI/180;
            return {x: dist*-Math.sin(radi), y: dist*Math.cos(radi)}
        }}
        svgIcon="rotation-marker"
    />
</g>