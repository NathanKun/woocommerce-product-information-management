// find variables of catg
temp1 = await $.get("https://pim.viecasa.com/api/products/")
pdts= []
temp1.data.forEach(it => {if (it.categoryIds == XX) pdts.push(it)});

// add parent(variable) sku in names list[[parent_name, self_name], [...], ...]
for (let i = 0; i < names.length; i++) {
	pn = names[i][0]
	for(let j = 0; j < pdts.length; j++) {
		if (pdts[j].name == pn) names[i].push(pdts[j].sku)
	}
}

// add variations in pim
$=jQuery;
for (let i = 0; i < names.length; i++) {
    const name = names[i];
    await $.ajax({
        type: "POST",
        url: "https://pim.viecasa.com/api/products/",
        contentType : 'application/json',
        data : JSON.stringify({
            "name": name[1],
            "type": "Variation",
            "categoryIds": [
                CATEGORY_ID // CHANGE THIS
            ],
            "parent": name[2],
            "attributes": [
                {
                    "name": "Meta: _supplier_product_code",
                    "value": ""
                },
                {
                    "name": "Name#fr",
                    "value": ""
                },
                {
                    "name": "Name#en",
                    "value": ""
                },
                {
                    "name": "Name#it",
                    "value": ""
                },
                {
                    "name": "Published#fr",
                    "value": "0"
                },
                {
                    "name": "Published#en",
                    "value": "0"
                },
                {
                    "name": "Published#it",
                    "value": "0"
                },
                {
                    "name": "Visibility in catalog#fr",
                    "value": "visible"
                },
                {
                    "name": "Visibility in catalog#en",
                    "value": "visible"
                },
                {
                    "name": "Visibility in catalog#it",
                    "value": "visible"
                },
                {
                    "name": "Short description#fr",
                    "value": ""
                },
                {
                    "name": "Short description#en",
                    "value": ""
                },
                {
                    "name": "Short description#it",
                    "value": ""
                },
                {
                    "name": "Description#fr",
                    "value": ""
                },
                {
                    "name": "Description#en",
                    "value": ""
                },
                {
                    "name": "Description#it",
                    "value": ""
                },
                {
                    "name": "Regular price#fr",
                    "value": "1"
                },
                {
                    "name": "Regular price#en",
                    "value": "1"
                },
                {
                    "name": "Regular price#it",
                    "value": "1"
                },
                {
                    "name": "Images#fr",
                    "value": ""
                },
                {
                    "name": "Images#en",
                    "value": ""
                },
                {
                    "name": "Images#it",
                    "value": ""
                },
                {
                    "name": "Weight (kg)",
                    "value": ""
                },
                {
                    "name": "Length (cm)",
                    "value": ""
                },
                {
                    "name": "Width (cm)",
                    "value": ""
                },
                {
                    "name": "Height (cm)",
                    "value": ""
                },
                {
                    "name": "Tags#fr",
                    "value": ""
                },
                {
                    "name": "Tags#en",
                    "value": ""
                },
                {
                    "name": "Tags#it",
                    "value": ""
                },
                {
                    "name": "Shipping class#fr",
                    "value": ""
                },
                {
                    "name": "Shipping class#en",
                    "value": ""
                },
                {
                    "name": "Shipping class#it",
                    "value": ""
                },
                {
                    "name": "Upsells#fr",
                    "value": ""
                },
                {
                    "name": "Upsells#en",
                    "value": ""
                },
                {
                    "name": "Upsells#it",
                    "value": ""
                },
                {
                    "name": "Cross-sells#fr",
                    "value": ""
                },
                {
                    "name": "Cross-sells#en",
                    "value": ""
                },
                {
                    "name": "Cross-sells#it",
                    "value": ""
                }
            ],
            "menuOrder": -1,
            "variationConfigurations": [],
            "id": -1
        }),
        success: res => console.log(res)}
    );
}
