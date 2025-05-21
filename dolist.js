document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("task-form");
  const todoList = document.getElementById("todo-list");
  const inProgressList = document.getElementById("inprogress-list");
  const doneList = document.getElementById("done-list");

  const dateDisplay = document.getElementById("date");
  // // dateDisplay.textContent = new Date().toDateString();
  // const today = new Date();
  // const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
  // dateDisplay.textContent = today.toLocaleDateString('en-GB', options).replace(/ /, ', ');

  const today = new Date();
  const weekday = today.toLocaleDateString('en-US', { weekday: 'short' });
  const day = today.getDate().toString().padStart(2, '0');
  const month = today.toLocaleDateString('en-US', { month: 'short' });
  const year = today.getFullYear();
  dateDisplay.textContent = `${weekday}, ${day} ${month} ${year}`;

  const editModal = document.getElementById("editModal");
  const closeModal = document.querySelector(".close");
  let currentEditCard = null;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("task-title").value;
    const desc = document.getElementById("task-desc").value;
    const reminderTime = document.getElementById("reminder").value;
    const alarmEnabled = document.getElementById("alarm").checked;
    const status = document.getElementById("task-status").value;

    const card = createTaskCard(title, desc, reminderTime);
    getListByStatus(status).appendChild(card);

    if (alarmEnabled && reminderTime) {
      const reminderDate = new Date(reminderTime).getTime();
      const now = new Date().getTime();
      const timeout = reminderDate - now;
      if (timeout > 0) {
        setTimeout(() => {
          alert(`⏰ Reminder: ${title}`);
        }, timeout);
      }
    }

    form.reset();
  });

  function createTaskCard(title, desc, time) {
    const li = document.createElement("li");
    li.className = "task-card";
    li.draggable = true;
    li.ondragstart = drag;

    li.innerHTML = `
      <h4>${title}</h4>
      <small>${desc}</small><br/>
      <small>⏰ ${time || 'No reminder'}</small>
      <button onclick="editTask(this)">✏️</button>
      <button onclick="deleteTask(this)">🗑️</button>
    `;
    return li;
  }

  window.editTask = function (btn) {
    currentEditCard = btn.parentElement;
    const title = currentEditCard.querySelector("h4").innerText;
    const desc = currentEditCard.querySelectorAll("small")[0].innerText;

    document.getElementById("edit-title").value = title;
    document.getElementById("edit-desc").value = desc;

    editModal.style.display = "block";
  };

  document.getElementById("saveEdit").onclick = () => {
    const newTitle = document.getElementById("edit-title").value;
    const newDesc = document.getElementById("edit-desc").value;

    currentEditCard.querySelector("h4").innerText = newTitle;
    currentEditCard.querySelectorAll("small")[0].innerText = newDesc;

    editModal.style.display = "none";
  };

  window.deleteTask = function (btn) {
    btn.parentElement.remove();
  };

  closeModal.onclick = () => {
    editModal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target == editModal) {
      editModal.style.display = "none";
    }
  };

  function getListByStatus(status) {
    return {
      "todo": todoList,
      "inprogress": inProgressList,
      "done": doneList
    }[status];
  }
});

// Drag and Drop
function allowDrop(e) {
  e.preventDefault();
}

function drag(e) {
  e.dataTransfer.setData("text", e.target.outerHTML);
  e.dataTransfer.effectAllowed = "move";
  e.target.remove();
}

function drop(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData("text");
  e.target.closest("ul").insertAdjacentHTML("beforeend", data);
}
