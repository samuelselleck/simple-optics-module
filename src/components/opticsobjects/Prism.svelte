<script>
    import OpticsObject from "./OpticsObject.svelte";
    import TranslationAnchor from '../anchors/TranslationAnchor.svelte'
    import RotationAnchor from '../anchors/RotationAnchor.svelte'
import { unitVecFromAngle, mult, rotate } from "../../utils/vectormath";
    
    export let properties;

    $: points =  (() => {
        let da = 2*Math.PI/properties.sides
        let outerRadius = properties.radius/Math.cos(da/2)
        let v = mult(unitVecFromAngle(da/2), outerRadius)
        let points = []
        for(let i = 0; i < properties.sides; i++) {
            let a = i*da
            points.push(rotate(v, a))
        }
        return points.map(v => `${v.x},${v.y}`).join(" ")
    })()
</script>

<OpticsObject {properties}>
    <svelte:fragment slot="object">
        <polygon fill="url(#glass)" {points}/>
    </svelte:fragment>
    <svelte:fragment slot="local">
        <TranslationAnchor bind:property={properties.radius} dir={{x: 1, y: 0}}/>
    </svelte:fragment>
    <svelte:fragment slot="global">
        <!--Rotation-->
        <RotationAnchor bind:property={properties.angle} start={Math.PI} distance={properties.radius + 100}/>
    </svelte:fragment>
</OpticsObject>

<style>
</style>