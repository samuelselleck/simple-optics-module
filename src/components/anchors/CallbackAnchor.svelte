<script>
    import { toLocalCoords, svgCanvas, zoomgroup} from '../../stores.js'

    export let start = undefined;
    export let changed;
    export let stop = undefined;
    export let pos = {x: 0, y: 0};
    export let relativeToObject = $zoomgroup;

    function down(event) {
        moving = true;
        if(start != undefined) {
            start(pos)
        }
    }

    function moved(event) {
        if(moving) {
            pos = $toLocalCoords(relativeToObject, {x: event.clientX, y: event.clientY})
            if(changed != undefined) {
                changed(pos)
            }
        }
    }

    function up(event) {
        if(moving && stop != undefined) {
            stop(pos)
        }
        moving = false;
    }

    let moving = false;
</script>

<svelte:window on:pointermove={moved} on:pointerup={up}/>

<g class:movable={!moving} on:pointerdown|stopPropagation={down}>
        <slot/>
</g>

<style>

    .movable {
        cursor: move;
    }
</style>