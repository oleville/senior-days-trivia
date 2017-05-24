let nextQuestion = async () => {
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

let resetz = async () => {
	let data = {command: 'resetSession'};
	fetch('/admin', {
		method: 'post',
		body: JSON.stringify(data),
		headers: new Headers({
			'Content-Type': 'application/json',
			Accept: 'application/json',
		})
	});
};
