(function (){
    let database = [];

    const submitBtn = document.getElementById('submit-btn');
    const city = document.getElementById('city');
    const country = document.getElementById('country');
    const budget = document.getElementById('budget');
    const dateStart = document.getElementById('date-start');
    const dateEnd = document.getElementById('date-end');
    const persons = document.getElementById('persons');
    const mainTransfer = document.getElementById('main-transfer');
    const historyItems = document.getElementById('items');

    const setItem = function (obj, index) {
        const persons = (obj.persons == 1)?'person':'persons';

        const itemHtml = `
        <div class="history-item">
            <div class="title">
                <div class="cities">
                    <h4>From Haifa to ${obj.city}</h4>
                </div>
                <div class="buttons">
                    <a href="#"><img src="images/pencil-square.svg" alt="Edit"></a>
                    <a href="#" class="delete-btn" data-index="${index}"><img src="images/x-circle.svg" alt="Delete"></a>
                    <a href="#"><img src="images/three-dots-vertical.svg" alt="Edit"></a>
                </div>
            </div>
            <div class="expected-budget">
                <span>Expected budget: ${obj.budget}</span>
            </div>
            <div class="dates-persons-transfer">
                <span>${obj.dateStart} - ${obj.dateEnd} | ${obj.persons} ${persons} | ${obj.mainTransfer}</span>
            </div>
        </div>
        `;
        return itemHtml;
    }

    function deleteElement() {
        database.splice(Number(this.dataset.index), 1);
        itemsRender();
    }

    function setDeleteButton() {
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(function (deleteButton) {
            deleteButton.onclick = deleteElement;
        });
    }

    function itemsRender() {
        const items = database.map(setItem);
        historyItems.innerHTML = items.join('');
        setDeleteButton()
    }

    const addRecord = function () {
        let newObj = {};
        if (city.value === "") {
            alert('Enter city');
            return
        } else {
            newObj.city = city.value;
        }

        if (country.value === "") {
            alert('Enter country');
            return
        } else {
            newObj.country = country.value;
        }

        newObj.budget = budget.value;
        newObj.dateStart = dateStart.value;
        newObj.dateEnd = dateEnd.value;
        newObj.persons = persons.value;
        newObj.mainTransfer = mainTransfer.value;
        database.unshift(newObj);

        itemsRender();
    }

    submitBtn.onclick = addRecord;
})()