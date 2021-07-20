<script>
    import PropertyAnchor from "../anchors/PropertyAnchor.svelte";
    import { toLocalCoords, zoomgroup } from "../../stores.js"
import { toDegrees, toRadians } from "../../utils/vectormath";


    export let properties;

    function update(e) {
        properties = properties;
    }

    const hidden = ["type", "id"]

    let format = v => v.toFixed(2)
    let parse = e => {
        console.log(e.target.value)
        let res = eval(e.target.value)
        console.log(res)
        return res
    }
    let setX = (property, e) => properties[property].x = parse(e);
    let setY = (property, e) => properties[property].y = parse(e);
    let set = (property, e) => properties[property] = parse(e);
    let setDeg = (property, e) => properties[property] = toRadians(parse(e));
</script>

<div class="container">
    {#if properties}
        {#each Object.keys(properties) as property}
            {#if !hidden.includes(property)}
                <span>{property}:</span> 
                {#if properties[property] && properties[property].hasOwnProperty('x') && properties[property].hasOwnProperty('y')}
                    <input value={format(properties[property].x)} on:change={e =>  setX(property, e)}/>
                    <input value={format(properties[property].y)} on:change={e =>  setY(property, e)}/>
                {:else if property == "angle"}
                    <input value={format(toDegrees(properties[property]))} on:change={e =>  setDeg(property, e)}/>
                    <span>°</span>
                {:else}
                    <input value={format(properties[property])} on:change={e =>  set(property, e)}/>
                {/if}
            {/if}
        {/each}
    {/if}
</div>

<!--Very inneficient to use this everywhere to detect updates, but works for now-->
<svelte:window on:pointermove={update}/>

<style>
    input {
        background-color: black;
        width: 5em;
        border: none;
        color: white;
        margin: 5px;
    }
</style>
