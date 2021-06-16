<script>
    import { toLocalCoords } from '../stores.js'

    export let property;
    export let behaviour = p => p; //move freely
    export let forwardEval = p => Math.sqrt(p.x*p.x + p.y*p.y); //distance to center
    export let backEval = v => ({x: v, y: 0});
    export let svgIcon = "anchor-marker";

    $: pos = backEval(property)

    let marker;
    let moving = false;

    function down(event) {
        moving = true;
    }

    function moved(event) {
        if(moving) {
            let move = $toLocalCoords(marker, {x: event.clientX, y: event.clientY})
            pos = behaviour(move)
            property = forwardEval(pos)
            console.log(property)
        }
    }

    function up(event) {
        moving = false;
    }

</script>

<svelte:window on:mousemove={moved} on:mouseup={up}/>

<use xlink:href={`#${svgIcon}`} bind:this={marker} on:mousedown={down} x={pos.x} y={pos.y}/>