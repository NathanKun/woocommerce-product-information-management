// step 1
const skuToNameMap = new Map();
for (const pdt of pdts) {
    if (pdt.type === "Variable") {
        let name = pdt.name;
        for (const attr of pdt.attributes) {
            if (attr.name === "Name#en" && attr.value && attr.value.length) {
                name = attr.value;
            }
        }
        skuToNameMap.set(pdt.sku, name)
    }
}



const data = []

for (const pdt of pdts.slice(0, 50)) {
    const images = []
    let name = pdt.name
    if (pdt.image && pdt.image.length) {
        images.push(pdt.image.substring(pdt.image.lastIndexOf("/") + 1, pdt.image.lastIndexOf(".")))
    }
    const attrs = pdt.attributes
    if (attrs && attrs.length) {
        for (const attr of attrs) {
            if (attr.name === "Images#fr" && attr.value && attr.value.length) {
                const value = JSON.parse(attr.value);
                for (const url of value) {
                    images.push(url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf(".")))
                }
            }
            
            if (attr.name === "Name#en" && attr.value && attr.value.length) {
                name = attr.value;
            }
        }
    }
    
    if (pdt.type === "Variation") {
        name = skuToNameMap.get(pdt.parent);
    }
    
    if (images.length) {
        data.push({name, images})
    }
}

console.log(data)

// step 2
for (const d of data.slice(0, 2)) {
    for (const url of d.images) {
        $.ajax({
            type: "GET",
            url: "https://www.viecasa.com/wp-json/wp/v2/media?search=" + url,
            async: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa("pim-media-lib" + ":" + "BxcN tqki zuP7 VkGl J4Qw VEDn"));
            },
            success: function (res) {
                if (res && res.length) {
                    $.ajax({
                        type: "POST",
                        url: "https://www.viecasa.com/wp-json/wp/v2/media/" + res[0].id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            dataType: 'json',
                        data: "title=" + d.name,
                        async: false,
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader ("Authorization", "Basic " + btoa("pim-media-lib" + ":" + "BxcN tqki zuP7 VkGl J4Qw VEDn"));
                        },
                        success: function (res) {
                            if (res && res.length) {
                                console.log(res)
                            }
                        }
                    });
                }
            }
        });
    }
}