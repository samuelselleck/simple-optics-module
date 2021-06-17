<script>
    import { toDegrees } from '../../utils/vectormath.js'
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

    $: translation = `translate(${properties.pos.x},${properties.pos.y})`;
    $: rotation = `rotate(${toDegrees(properties.angle)}, 0, 0)`;

</script>

<svelte:window on:mousemove={moved} on:mouseup={up}/>

<g transform={translation}>
    <g transform={rotation}>
        <g on:mousedown={down} >
        <slot name="object"/>
        </g>
        <slot name="local"/>
    </g>
    <slot name="global"/>
</g>