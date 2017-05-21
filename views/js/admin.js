let nextQuestion = async () => {
	fetch('/admin', {
		method: 'post',
		body: {
			command: 'nextQuestion'
		}
	});
};
