$=jQuery;
simples.forEach((p, i) => {
	let found = null
	variables.forEach(v => {
		if (p.name.indexOf(v.name + " ") > -1)
			found = v
	})
	if (found == null) {
		console.log("Parent of " + p.name + " not found")
		return
	}
	p.type = "Variation"
	p.parent = found.sku
	setTimeout(() => {
		$.ajax({
			type: "PUT",
			url: "https://pim.viecasa.com/api/products/",
			contentType : 'application/json',
			data : JSON.stringify(p),
			success: res => console.log(res)}
		)
	}, i * 750)
})