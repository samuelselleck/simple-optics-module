<script>
    import OpticsObject from "./OpticsObject.svelte";
    import TranslationAnchor from '../anchors/TranslationAnchor.svelte'
    import RotationAnchor from '../anchors/RotationAnchor.svelte'
    import { idealMode } from '../../stores'
    export let properties;
    $: h = properties.height
    let w = 100;

    $: path = () => {
        if($idealMode) {
            let r = -properties.curve
            if (r == 0) {
                return`
                    M${0},${-h/2}
                    h${w}
                    v${h}
                    h${-w}
                    z`
            } else if (r > 0) { //Convex
                r = Math.max(-properties.curve*4, h)
                return`
                    M0,${-h/2}
                    a${r},${r} 0 0,0 0,${h},${w}
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
        <rect fill="url(#glass)" width={10000} height={properties.height} x={0} y={-properties.height/2}/>   
    <path fill="url(#glass)" d={path()} x={0} y={-properties.height/2}/> <!--<path width={1000000} height={properties.height} x={0} y={-properties.height/2}/>-->
    </svelte:fragment>
    <svelte:fragment slot="local">
        <!--Height-->
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: 1}} scale=0.5/>
        <!--<TranslationAnchor bind:property={properties.height} dir={{x: 0, y: -1}} scale=0.5/>-->
        <TranslationAnchor bind:property={properties.curve} dir={{x: -1, y: 0}} forwardEvalOverride={lockToCenter}/>
    </svelte:fragment>
    <svelte:fragment slot="global">
        <!--Rotation-->
        <!--<RotationAnchor bind:property={properties.angle} start={Math.PI} distance={properties.height/4 + 100}/>-->
    </svelte:fragment>
</OpticsObject>


