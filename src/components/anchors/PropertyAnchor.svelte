<script>
    import { sub, add } from "../../utils/vectormath";
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

    let marker;

</script>

<CallbackAnchor bind:pos relativeToObject={marker} {changed} {start}>
    <g bind:this={marker}>
        <g transform="translate({pos.x}, {pos.y})">
            <slot/>
        </g>
    </g>
</CallbackAnchor>