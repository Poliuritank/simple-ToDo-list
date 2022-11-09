// находим элементы в разметке которые участвуют в добавлении новых елементов
const form = document.querySelector('.form')
const formInput = document.querySelector('.form-input')
const formTitle = document.querySelector('.form-title')
const taskList = document.querySelector('.task-list')
const curDate = new Date ()

let options = {	weekday:'long',year: 'numeric',month: 'long', day: 'numeric'} // параметры даты
// вешаем актуальную дату в разметку
let now = curDate.toLocaleString('en', options)
const datePar = document.createElement('p')
datePar.append(now)
formTitle.insertAdjacentElement('beforeend', datePar)

//создаем массив в который будем записывать и удалять задачи

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	// метод парс преображает строку из локал сторедж в массив и берет для отображения
	tasks.forEach(function (task) {
		renderTask(task)
	})
}





form.addEventListener('submit', addTask) // фанкшн декларейшн
taskList.addEventListener('click', deleteTask)
        // так как элементы таска добавляются динамычески мы не можем обратиться конкретно к кнопке
        // по этому будем обращаться к родителю (УЛ) и будем считывать таргет и от него плясать
taskList.addEventListener('click', taskDone)


// functions
function addTask(event) {
	event.preventDefault()
	if (!formInput.value) return // если сабмит происходит с пустым значением инпута (!forminput.value - не! велью) то 
                                    // происходит ретерн а после него работа функции завершается

	// определяем текст задачи
	const taskText = formInput.value

	//РАБОТА С ДАННЫМИ
	// создаем задачу в виде обьекта который будем записывать в массив
	const localTask = {
		id: Date.now(),	// время в милисекундах как уникальный id
		text: taskText, // текст задачи записанный в переменную
		done: false		// статус фолс (на старте нужен фолс так как при тру будем добавлять класс done)
	};
	
	// записываем задачу (обьект) в массив с задачами (tasks)
	tasks.push(localTask);	//метод пуш добавляет обьект локалТаск в конец массива

	saveToLocalStorege()

	renderTask(localTask)

	// some cosmetics
	formInput.value = '' // очищаем инпут после сабмита
	formInput.focus() // оставляем фокус на инпуте после сабмита
}

function deleteTask(event) {
	event.preventDefault()
	// console.log(event.target) // проверяем работает ли таргет
    if (event.target.classList.contains('btn-delete')) {
			const parent = event.target.closest('li') // записываем в переменную юлижайшую таргету лишку

			//ОПРЕДЕЛЯЕМ ID
			const id = Number(parent.id) //метод намбер преобразует строку в число
			// 1 способ. Находим задачу по индексу в массиве
			// const index = tasks.findIndex(function(task){		// метод файнд индекс похож на фор ич (перебирает все елементы массива)
				// if (task.id === id) {
			// 		return true
			// 		// можно проще записать условие так как ретерн и так вернет тру или фолс при строгом сравнении
			// 		// return task.id === id (иперевести в стрелочную)
					const index = tasks.findIndex( (task) => task.id === id)
				// }
			// })

			// удаляем задачу из массива
			tasks.splice(index, 1)

			// 2 способ. Фильтруем массив для того чтоб нужная задача не попала в новый массив
			// tasks = tasks.filter(function (task) {
			// 	// метод фильтр обойдет массив по всем элементам и для каких элементов вернется тру не попадут в новый массив
			// 										// а элем фолс попадут в новый массив
			// 	if (task.id === id) {
			// 		return false
			// 	} else {
			// 		return true
			// 	}
			// })
			// tasks = tasks.filter((task) => task.id !== id) // или такая короткая запись
			//  если таск ид Не равно ид то вернет тру и они запишуться в новый массив, а те что не Неравны, то есть равны - фолс, и будут удалены
			
			saveToLocalStorege()

			parent.remove() // удаляем эту лишку
		}
}
    
function taskDone(event) {
    event.preventDefault()
    if (event.target.classList.contains('btn-done')) {
		const parent = event.target.closest('li') // пришлось идти к спану через родителя потому что сразу спан по ближайшему классу не нашло

		const id = Number(parent.id)
		const task = tasks.find((task) => task.id === id) //
		task.done = !task.done // переворачивает тру в фолс и наоборот // меняем статус

		saveToLocalStorege()
					

		const tasktitle = parent.querySelector('span')
		tasktitle.classList.toggle('task-done')
	}
}


function saveToLocalStorege() {
	localStorage.setItem('tasks', JSON.stringify(tasks)) // преображает массив в строку и записывает
}

function renderTask(task) {
	const cssClass = task.done ? 'task-title task-done' : 'task-title'

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
                    `
	taskList.insertAdjacentHTML('beforeend', newTask)
}