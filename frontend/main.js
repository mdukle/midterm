let data = [];
const api = 'http://127.0.0.1:8000/reagents';
let reagentIdInEdit = 0;

document.getElementById('add-btn').addEventListener('click', (e) => {
    e.preventDefault()

    // get id from form input in modal and assign to what will be added by using .value
    const msgDiv = document.getElementById('msg');
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('desc');

    if (!titleInput.value || !descInput.value) {
        msgDiv.innerHTML = 'Please provide non-empty Title and Description when creating a new Reagent'
        return;
    }

    const xhr = new XMLHttpRequest()

    xhr.onload = () => {
        if (xhr.status === 201) {
            const newReagent = JSON.parse(xhr.response);
            data.push(newReagent);
            renderReagents(data);

            // close modal dialog
            // if using fetch, use "then"
            const closeBtn = document.getElementById('close-add-modal');
            closeBtn.click();

            // clean up error message
            msgDiv.innerHTML = '';
            titleInput.value = '';
            descInput.value = '';
        }
    };

    // with POST, need to send a body with post
    xhr.open('POST', api, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.send(JSON.stringify({ title: titleInput.value, desc: descInput.value }));

});

document.getElementById('edit-btn').addEventListener('click', (e) => {
    e.preventDefault()

    // get id from form input in modal and assign to what will be added by using .value
    const msgDiv = document.getElementById('msgEdit');
    const titleInput = document.getElementById('titleEdit');
    const descInput = document.getElementById('descEdit');

    if (!titleInput.value || !descInput.value) {
        msgDiv.innerHTML = 'Please provide non-empty Title and Description when creating a new Reagent'
        return;
    }

    const xhr = new XMLHttpRequest()

    xhr.onload = () => {
        if (xhr.status === 200) {
            const newReagent = JSON.parse(xhr.response);
            const reagent = data.find((x) => x.id == reagentIdInEdit);
            reagent.title = newReagent.title;
            reagent.desc = newReagent.desc;
            renderReagents(data);

            // close modal dialog
            // if using fetch, use "then"
            const closeBtn = document.getElementById('close-edit-modal');
            closeBtn.click();

            // clean up error message
            msgDiv.innerHTML = '';
            titleInput.value = '';
            descInput.value = '';
        }
    };

    // with POST, need to send a body with post
    xhr.open('PUT', api + "/" + reagentIdInEdit, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.send(JSON.stringify({ title: titleInput.value, desc: descInput.value }));

})

function deleteReagent(id) {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status == 200) {
            data = data.filter((x) => x.id != id); // filter ids that are all except the chosen id
            renderReagents(data); // refreshes todos
        }
    };


    // get api link from docs on page. need to open and send xhr request
    xhr.open('DELETE', api + "/" + id, true);
    xhr.send();
}

function setReagentInEdit(id) {
    reagentIdInEdit = id;
}

function renderReagents(data) {
    const reagentDiv = document.getElementById("reagents");
    reagentDiv.innerHTML = ''
    data.sort((a, b) => b.id - a.id).forEach(x => {
        reagentDiv.innerHTML += `
        <div id = "reagent-${x.id}" class="reagent-box">
            <div class = "fw-bold fs-4">${x.title}</div>
            <pre class = "text-secondary ps-3">${x.desc}</pre>
            <div>
                <button type="button" class = "btn btn-success btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-edit"
                    onClick="setReagentInEdit(${x.id})"
                >
                    Edit
                </button>
                <button type="button" class = "btn btn-danger btn-sm"
                    onClick='deleteReagent(${x.id})'
                >
                Delete
                </button>
            </div>
        </div>
        `; // names must match the other ones from the app
    });
}

function getAllReagents() {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status == 200) {
            data = JSON.parse(xhr.response) || []
            console.log(data);
            renderReagents(data);
        }
    };


    // get api link from docs on page. need to open and send xhr request
    xhr.open('GET', api, true);
    xhr.send();
}

(() => {
    getAllReagents()
})();