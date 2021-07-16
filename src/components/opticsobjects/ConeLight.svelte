<script>
    import OpticsObject from "./OpticsObject.svelte";
    import TranslationAnchor from '../anchors/TranslationAnchor.svelte'
    import RotationAnchor from '../anchors/RotationAnchor.svelte'
    
    export let properties;

</script>

<OpticsObject {properties}>
    <svelte:fragment slot="object">
        <polygon points="{-properties.length - 10},0 0,{properties.height/2 + 10} 0,{-properties.height/2 - 10}" fill="url(#metal)"/>
    </svelte:fragment>
    <svelte:fragment slot="local">
        <!--Height-->
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: 1}} scale=0.5/>
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: -1}} scale=0.5/>
        <TranslationAnchor bind:property={properties.length} dir={{x: -1, y: 0}}/>
    </svelte:fragment>
    <svelte:fragment slot="global">
        <!--Rotation-->
        <RotationAnchor bind:property={properties.angle} start={Math.PI} distance={properties.height/4 + 100}/>
    </svelte:fragment>
</OpticsObject>