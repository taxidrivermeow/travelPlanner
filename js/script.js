(function () {
    const city = document.getElementById('city');
    const country = document.getElementById('country');
    const budget = document.getElementById('budget');
    const dateStart = document.getElementById('date-start');
    const dateEnd = document.getElementById('date-end');
    const persons = document.getElementById('persons');
    const mainTransfer = document.getElementById('main-transfer');
    const historyItems = document.getElementById('items');
    const travelForm = document.getElementById('travel-form');
    const clearData = document.getElementById('clear-data');

    const setItem = function (obj, index) {
        const persons = (obj.persons == 1) ? 'person' : 'persons';
        return `
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
    }

    const addDeleteOnClickListener = function (deleteButton) {
        deleteButton.onclick = deleteElement;
    }

    const addRecord = function (event) {
        event.preventDefault();
        const data = getDatabase();
        let newObj = {};
        newObj.city = city.value;
        newObj.country = country.value;
        newObj.budget = budget.value;
        newObj.dateStart = dateStart.value;
        newObj.dateEnd = dateEnd.value;
        newObj.persons = (persons.value === 'Choose...') ? '' : persons.value;
        newObj.mainTransfer = (mainTransfer.value === 'Choose...') ? '' : mainTransfer.value;
        data.unshift(newObj);
        setDatabase(data);

        this.reset();
        itemsRender();
    }

    function deleteElement() {
        let data = getDatabase();
        data.splice(Number(this.dataset.index), 1);
        setDatabase(data);

        itemsRender();
    }

    function setDeleteButton() {
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(addDeleteOnClickListener);
    }

    function itemsRender() {
        const items = getDatabase().map(setItem);
        historyItems.innerHTML = items.join('');
        setDeleteButton();
    }

    function getDatabase() {
        return (localStorage.getItem('travels')) ? JSON.parse(localStorage.getItem('travels')) : [];
    }

    function setDatabase(data) {
        localStorage.setItem("travels", JSON.stringify(data));
    }

    function clearDatabase() {
        localStorage.setItem("travels", "");
        itemsRender();
    }

    travelForm.onsubmit = addRecord;
    clearData.onclick = clearDatabase;
    itemsRender();
})()