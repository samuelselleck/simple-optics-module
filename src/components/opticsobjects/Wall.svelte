<script>
    import OpticsObject from "./OpticsObject.svelte";
    import TranslationAnchor from '../anchors/TranslationAnchor.svelte'
    import RotationAnchor from '../anchors/RotationAnchor.svelte'
    
    export let properties;

</script>

<OpticsObject {properties}>
    <svelte:fragment slot="object">
        <rect width={properties.width} height={properties.height} x={-properties.width/2} y={-properties.height/2}/>
    </svelte:fragment>
    <svelte:fragment slot="local">
        <!--Height-->
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: 1}} scale=0.5/>
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: -1}} scale=0.5/>
        <TranslationAnchor bind:property={properties.width} dir={{x: 1, y: 0}} scale=0.5/>
        <TranslationAnchor bind:property={properties.width} dir={{x: -1, y: 0}} scale=0.5/>
    </svelte:fragment>
    <svelte:fragment slot="global">
        <!--Rotation-->
        <RotationAnchor bind:property={properties.angle} start={Math.PI} distance={properties.height/4 + 100}/>
    </svelte:fragment>
</OpticsObject>

<style>
    rect {
        fill: url(#metal)
    }
</style>