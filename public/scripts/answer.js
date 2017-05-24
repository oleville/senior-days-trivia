let submitAnswer = async (button) => {
	console.log(button.name);
	let data = {answerId: button.name.slice(-1).toLowerCase()}; // get the name of the button, and derive the Id from the name of the button
	fetch('/answer', {
		method: 'post',
		body: JSON.stringify(data),
		headers: new Headers({
			'Content-Type': 'application/json',
			Accept: 'application/json',
		})
	});
};
