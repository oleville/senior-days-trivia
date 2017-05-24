let nextQuestion = async () => {
	console.log('submitting');
	let data = {command: 'nextQuestion'};
	fetch('/admin', {
		method: 'post',
		body: JSON.stringify(data),
		headers: new Headers({
			'Content-Type': 'application/json',
			Accept: 'application/json',
		})
	});
};
