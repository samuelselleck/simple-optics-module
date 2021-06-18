<script>
    import { toDegrees } from '../../utils/vectormath.js'
    import { selectedApparatus } from '../../stores.js'
    export let properties;

    let moving = false;
    let anchor = {x: 0, y: 0}

    function down(event) {
        moving = true;
        anchor = {x: properties.pos.x - event.clientX, y: properties.pos.y - event.clientY}
        $selectedApparatus = properties.id;
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
    $: selected = $selectedApparatus == properties.id;
</script>

<svelte:window on:pointermove={moved} on:pointerup={up}/>

<g transform={translation}>
    <g transform={rotation}>
        <g class:movable={!moving} on:pointerdown={down} >
            <slot name="object"/>
        </g>
        <g class:collapsed={!selected}>
            <slot name="local"/>
        </g>
    </g>
    <g class:collapsed={!selected}>
        <slot name="global"/>
    </g>
</g>

<style>
    .movable {
        cursor: move;
    }

    .collapsed {
        visibility: collapse;
    }
</style>