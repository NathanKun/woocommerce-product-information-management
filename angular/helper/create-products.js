$=jQuery;
for (let i = 0; i < names.length; i++) {
    const name = names[i];
    await $.ajax({
        type: "POST",
        url: "https://pim.viecasa.com/api/products/",
        contentType : 'application/json',
        data : JSON.stringify({
            "name": name,
            "type": XXX, // Simple, Variable, Variation
            "categoryIds": [
                XXX // CHANGE THIS
            ],
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
