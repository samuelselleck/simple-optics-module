<script>
import { onMount } from "svelte";

    import { scale } from "../../stores.js";
    import { sub, add } from "../../utils/vectormath";
    import { isTouchDevice } from '../../utils/utils';
    import CallbackAnchor from "./CallbackAnchor.svelte";


    export let property = {x: 0, y: 0}
    export let behaviour = p => p;
    export let forwardEval = p => p;
    export let backEval = v => v;

    let pos;
    let anchor;

    $: pos = backEval(property), pos;

    function start(newpos) {
        anchor = sub(pos, newpos)
    }

    function changed(newpos) {
        pos = behaviour(add(newpos, anchor))
        property = forwardEval(pos)
    }

    let isTouch = false;
    onMount(() => {
        isTouch = isTouchDevice()
    })

    $: markerScale = 1/$scale*(isTouch ? 1.7 : 1);

    let marker;
</script>

<CallbackAnchor bind:pos relativeToObject={marker} {changed} {start}>
    <g bind:this={marker}>
        <g transform="translate({pos.x}, {pos.y}) scale({markerScale})">
            <slot/>
        </g>
    </g>
</CallbackAnchor>