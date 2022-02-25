<script>
    import OpticsObject from "./OpticsObject.svelte";
    import TranslationAnchor from '../anchors/TranslationAnchor.svelte'
    import RotationAnchor from '../anchors/RotationAnchor.svelte'
    import { idealMode } from '../../stores'

    export let properties;


    $: h = properties.height
    let w=8
    $: path = () => {
        if($idealMode) { // ideal mode
            let r = -properties.curve
            if (r == 0) {
                return`
                    M${-w/2},${-h/2}
                    h${w}
                    v${h}
                    h${-w}
                    z`
            } else if (r > 0) { //Convex, 
                r = Math.max(-properties.curve*4, h) 
                return`
                    M0,${-h/2}
                    a${r},${r} 0 0,0 0,${h}
                    z`

            } else { //Concave
                r = Math.max(properties.curve*4, h);
                let d = r - Math.sqrt(r*r - h*h/4) + 1
                return`
                    M${-d},${h/2} 
                    a${r},${r} 0 0,0 0,-${h}
                    h${d + 20}
                    v${h}
                    z`
            }
        } else {
            let r = (properties.height*properties.height/4 + properties.curve*properties.curve)/properties.curve/2
            return `M0,${h/2} a${r},${r} 0 0,${r < 0 | 0} 0,-${h}`
        }
    }

    function lockToCenter(v) {
        return Math.abs(v) < properties.height/20 ? 0 : v;
    }
</script>

<OpticsObject {properties}>
    <svelte:fragment slot="object">
        <path fill="url(#mirror)" d={path()}/>
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
    path {
        fill: url(#glass)
    }
</style>
