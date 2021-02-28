import { getDataFromApi, addTaskToApi, deleteTaskFromApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$taskFormSubmitter = this.$taskForm.querySelector('button');
  }

  changeTaskButton() {
    const $taskSubmitter = this.$taskFormSubmitter;
    if ($taskSubmitter.innerText == 'Add Task') {
      $taskSubmitter.disabled = true;
      $taskSubmitter.innerText = 'Adding Task...';
    } 
    else {
      $taskSubmitter.disabled = false;
      $taskSubmitter.innerText = 'Add Task';     
    }
  }

  addTask(task) {
    this.changeTaskButton();
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.changeTaskButton();
      });
  }

  deleteTask(id) {
    const $btn = document.getElementById(`${id}`);
    $btn.addEventListener('click', () => {
      deleteTaskFromApi(id).then((res) => {
        debugger;
        if (res.status === 200) {
          document.querySelector(`tr[id="${id}"]`).remove();
          alert('Task deleted succesfully!');
        } else {
          alert('Error occurred!');
        }
      });
    });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.setAttribute('id', task.id);
    $newTaskEl.innerHTML = `<th scope="row">${task.id}</th><td>${task.title}</td>
    <td><button class="btn btn-danger" id="${task.id}" style="border-radius:1em;">Delete</button></td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.deleteTask(task.id);
    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      if (task.title.trim()) {
        this.addTask(task);
      } 
      else {
        alert('Area cannot be empty!');
      }
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;
