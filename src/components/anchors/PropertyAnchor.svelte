<script>
    import { toLocalCoords} from '../../stores.js'

    export let property;
    export let behaviour = p => p;
    export let forwardEval = p => Math.sqrt(p.x*p.x + p.y*p.y);
    export let backEval = v => ({x: v, y: 0});
    export let svgIcon = "anchor-marker";
    export let transform = "";

    /*Don't change the below statement to a normal reactive statement
      This fixes a bug where property anchors don't update properly when others changing the same property do 
      (changes reactive statement update order)*/
    let pos;
    $: {pos = backEval(property); pos;};

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
        }
    }

    function up(event) {
        moving = false;
    }

</script>

<svelte:window on:mousemove={moved} on:mouseup={up}/>

<g class:collapsed={false} bind:this={marker} on:mousedown={down}>
    <g class:movable={!moving} transform={`translate(${pos.x}, ${pos.y})`}>
    <use {transform} xlink:href={`#${svgIcon}`}/>
    </g>
</g>

<style>
    .collapsed {
        visibility: collapse;
    }

    .movable {
        cursor: move;
    }
</style>