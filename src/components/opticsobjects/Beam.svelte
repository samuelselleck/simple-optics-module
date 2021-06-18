<script>
    import OpticsObject from "./OpticsObject.svelte";
    import TranslationAnchor from '../anchors/TranslationAnchor.svelte'
    import RotationAnchor from '../anchors/RotationAnchor.svelte'
    
    export let properties;

</script>

<OpticsObject {properties}>
    <g slot="object">
        <rect width={properties.height/4} height={properties.height} x={-properties.height/4} y={-properties.height/2}/>
    </g>
    <g slot="local">
        <!--Height-->
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: 1}} scale=0.5/>
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: -1}} scale=0.5/>
    </g>
    <g slot="global">
        <!--Rotation-->
        <RotationAnchor bind:property={properties.angle} start={Math.PI} distance={properties.height/4 + 100}/>
    </g>
</OpticsObject>

<style>
    rect {
        fill: url(#metal)
    }
</style>