const todoValue = document.getElementById("todoText"),
    listItems = document.getElementById("list-items"),
    UpdateClick = document.getElementById("UpdateClick"),
    AlertMessage = document.getElementById("AlertMessage");

let updateText;
let todoData = JSON.parse(localStorage.getItem("todoData"));
if (!todoData) {
    todoData = [];
}

todoValue.addEventListener("keypress", function (e) {
    SetAlertMessage("");
    if (e.key == "Enter") {
        UpdateClick.click();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    ReadToDoItems();
    listItems.addEventListener("change", handleCheckboxChange);
});

function ReadToDoItems() {
    todoData.forEach((element) => {
        let li = document.createElement("li");

        const todoItems = `<label class="checkbox-label">
                              <input type="checkbox" ${element.status ? 'checked' : ''}>
                              <span class="checkbox-custom"></span>
                            </label>
                            <div>${element.item}</div>
                            <div>
                                <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/pencil.png"/>
                                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/bin.png"/>
                            </div>`;
        li.innerHTML = todoItems;
        listItems.appendChild(li);
    });
}

function handleCheckboxChange(event) {
    const checkbox = event.target;
    const todoItem = checkbox.parentElement.parentElement.querySelector("div");
    updateText = todoItem.innerText.trim();


    todoData.forEach((element) => {
        if (updateText === element.item) {
            element.status = checkbox.checked;
        }
    });

    setLocalStorage();
    
    if (event.detail === 0) {
        event.preventDefault();
    }
}


function CreateToDoData() {
    if (todoValue.value === "") {
        SetAlertMessage("Please enter your todo List!");
        todoValue.focus();
    } else {
        if (updateText) {
            UpdateOnSelectedItems();
        } else {
            let li = document.createElement("li");

            li.id = "someUniqueID";

            const todoItems = `<label class="checkbox-label">
                                  <input type="checkbox" onchange="CompleteToDoItem(this)">
                                  <span class="checkbox-custom"></span>
                                </label>
                                <div>${todoValue.value}</div>
                                <div>
                                    <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/pencil.png"/>
                                    <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/bin.png"/>
                                </div>`;

            li.innerHTML = todoItems;
            listItems.appendChild(li);

            let dataItem = { item: todoValue.value, status: false };
            todoData.push(dataItem);
            setLocalStorage();

            todoValue.value = "";
            SetAlertMessage("Todo item Created Successfully.");
        }
    }
}

function CompleteToDoItem(checkbox) {
    const todoItem = checkbox.parentElement.parentElement.querySelector("div");
    todoItem.style.textDecoration = checkbox.checked ? "line-through" : "";

    updateText = todoItem.innerText.trim();

    todoData.forEach((element) => {
        if (updateText === element.item) {
            element.status = checkbox.checked;
        }
    });

    setLocalStorage();
}


function UpdateOnSelectedItems() {
    for (let i = 0; i < todoData.length; i++) {
        if (todoData[i].item === updateText) {
            todoData[i].item = todoValue.value;
            break; 
        }
    }

    const listItem = findListItem(updateText);
    if (listItem) {
        listItem.querySelector("div").innerText = todoValue.value;
    }

    setLocalStorage();

    todoValue.value = "";
    UpdateClick.setAttribute("onclick", "CreateToDoData()");
    UpdateClick.setAttribute("src", "/add.png");
    updateText = null; 
}

function findListItem(itemText) {
    const listItems = document.querySelectorAll("#list-items li");
    for (const listItem of listItems) {
        if (listItem.querySelector("div").innerText.trim() === itemText) {
            return listItem;
        }
    }
    return null;
}

function UpdateToDoItems(e) {
    if (e.parentElement.parentElement.querySelector("div").style.textDecoration === "") {
        updateText = e.parentElement.parentElement.querySelector("div").innerText;
        todoValue.value = updateText; 
        UpdateClick.setAttribute("onclick", "UpdateOnSelectedItems()");
        UpdateClick.setAttribute("src", "/refresh.png");
    }
}

function ToggleComplete(element) {
    const checkbox = element.parentElement.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    CompleteToDoItem(checkbox);
}

function DeleteToDoItems(e) {
    let deleteValue = e.parentElement.parentElement.querySelector("div").innerText.trim();

    if (confirm(`Are you sure? Do you want to delete this ${deleteValue} item?`)) {
        console.log("Before deletion:", todoData);

        todoData = todoData.filter((element) => element.item !== deleteValue);

        console.log("After deletion:", todoData);

        e.parentElement.parentElement.setAttribute("class", "delete-item");

        setTimeout(() => {
            e.parentElement.parentElement.remove();
        }, 1000);

        todoValue.focus();
        setLocalStorage();
    }
}

function setLocalStorage() {
    localStorage.setItem("todoData", JSON.stringify(todoData));
    console.log("Updated todoData in local storage:", todoData);
}


function SetAlertMessage(message) {
    AlertMessage.removeAttribute("class");
    AlertMessage.innerText = message; 

    setTimeout(() => {
        AlertMessage.classList.add("toggleMe");
    }, 1000);
}
