const form = document.querySelector('.form');
const formInput = document.querySelector('.form-input');
const formTitle = document.querySelector('.form-title');
const taskList = document.querySelector('.task-list');
const listDiv = document.querySelector('.list-div');
const curDate = new Date();
const delComplTasksBtn = `
	<div class="form">
		<button class="submit-btn button">Delete completed</button>
	</div>
`;
listDiv.insertAdjacentHTML('beforeend', delComplTasksBtn);

listDiv.addEventListener('click', delComplTask);

let options = {
	weekday: 'long',
	year: 'numeric',
	month: 'long',
	day: 'numeric',
};
let now = curDate.toLocaleString('en', options);
const datePar = document.createElement('p');
datePar.append(now);
formTitle.insertAdjacentElement('beforeend', datePar);

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach(function (task) {
		renderTask(task);
	});
}

form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', taskDone);

// functions
function addTask(event) {
	event.preventDefault();
	if (!formInput.value) return;
	const taskText = formInput.value;

	const localTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};

	tasks.push(localTask);

	saveToLocalStorege();

	renderTask(localTask);

	formInput.value = '';
	formInput.focus();
}

function deleteTask(event) {
	event.preventDefault();
	if (event.target.classList.contains('btn-delete')) {
		const parent = event.target.closest('li');
		const id = Number(parent.id); //метод намбер преобразует строку в число
		const index = tasks.findIndex((task) => task.id === id);
		tasks.splice(index, 1);
		saveToLocalStorege();
		parent.remove();
	}
}

function taskDone(event) {
	event.preventDefault();
	if (event.target.classList.contains('btn-done')) {
		const parent = event.target.closest('li');
		const id = Number(parent.id);
		const task = tasks.find((task) => task.id === id); //
		task.done = !task.done;
		saveToLocalStorege();
		const tasktitle = parent.querySelector('span');
		tasktitle.classList.toggle('task-done');
	}
}

function delComplTask(event) {
	if (event.target.classList.contains('button')) {
		const doneTask = document.querySelectorAll('.task-done');
		doneTask.forEach((task) => {
			const parent = task.closest('li');
			const id = Number(parent.id);
			const index = tasks.findIndex((task) => task.id === id);
			tasks.splice(index, 1);
			saveToLocalStorege();
			parent.remove();
		});
	}
}

function saveToLocalStorege() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
	const cssClass = task.done ? 'task-title task-done' : 'task-title';

	const newTask = `
										<li id="${task.id}" class="task-item">
											<span class="${cssClass}">${task.text}</span>
											<div class="task-item__buttons">
												<button type="button"class="btn-action btn-done">Done
												</button>
												<button type="button" class="btn-action btn-delete">Del.
												</button>
											</div>
										</li
                    `;
	taskList.insertAdjacentHTML('beforeend', newTask);
}
