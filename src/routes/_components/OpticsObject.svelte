<script>

    export let properties = {pos: {x: 50, y: 50}}

    let moving = false;
    let anchor = {x: 0, y: 0}

    function down(event) {
        moving = true;
        anchor = {x: properties.pos.x - event.clientX, y: properties.pos.y - event.clientY}
    }

    function moved(event) {
        if(moving) {
            properties.pos.x = event.clientX + anchor.x;
            properties.pos.y = event.clientY + anchor.y;
        }
    }

    function up(event) {
        moving = false;
    }

    $: render_string = (p => {
        let x = p.pos.x
        let y = p.pos.y
        let h = p.height
        let f = p.focal
        return `M${x},${y + h/2} a${f},${f} 0 0,0 0,-${h} a${f},${f} 0 0,0 0,${h}`
    })(properties)

</script>

<path 
    on:mousedown={down}
    on:mousemove={moved}
    on:mouseup={up}
    d={render_string}
    fill="url(#glass)"/>

<defs>
    <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:white;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:white;stop-opacity:0.6" />
    </linearGradient>
</defs>