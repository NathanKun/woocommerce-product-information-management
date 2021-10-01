$=jQuery;
for (let i = ID_START; i <= ID_END; i++) {
		setTimeout(() => {
		$.ajax({
			type: "DELETE",
			url: "https://pim.viecasa.com/api/products/",
			contentType : 'application/json',
			data : JSON.stringify({id: i}),
			success: res => console.log(res)}
		)
	}, (i-ID_START) * 750)
}