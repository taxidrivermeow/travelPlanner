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

    const cityModal = document.getElementById('modal-city');
    const countryModal = document.getElementById('modal-country');
    const budgetModal = document.getElementById('modal-budget');
    const dateStartModal = document.getElementById('modal-date-start');
    const dateEndModal = document.getElementById('modal-date-end');
    const personsModal = document.getElementById('modal-persons');
    const mainTransferModal = document.getElementById('modal-main-transfer');
    const editTravelForm = document.getElementById('edit-travel-form');

    const setItem = function (obj, index) {
        const persons = (obj.persons == 1) ? 'person' : 'persons';
        return `
        <div class="history-item">
            <div class="title">
                <div class="cities">
                    <h4>From Haifa to ${obj.city}/${obj.country}</h4>
                </div>
                <div class="buttons">
                    <a href="#" class="edit-btn" data-index="${index}" data-toggle="modal" data-target="#travelModalLong"><img src="images/pencil-square.svg" alt="Edit"></a>
                    <a href="#" class="delete-btn" data-index="${index}"><img src="images/x-circle.svg" alt="Delete"></a>
                    <a href="#"><img src="images/three-dots-vertical.svg" alt="Details"></a>
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

    const addDeleteOnClickListener = function (deleteButton) {
        deleteButton.onclick = deleteElement;
    }

    function setDeleteButton() {
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(addDeleteOnClickListener);
    }

    function saveChanges(event) {
        event.preventDefault();
        const index = editTravelForm.dataset.index;
        const data = getDatabase();
        data[index].city = cityModal.value;
        data[index].country = countryModal.value;
        data[index].budget = budgetModal.value;
        data[index].dateStart = dateStartModal.value;
        data[index].dateEnd = dateEndModal.value;
        data[index].persons = (personsModal.value === 'Choose...') ? '' : personsModal.value;
        data[index].mainTransfer = (mainTransferModal.value === 'Choose...') ? '' : mainTransferModal.value;

        setDatabase(data);
        itemsRender();
        $('#travelModalLong').modal('hide');
    }

    function editElement() {
        const index = this.dataset.index;
        const data = getDatabase()[index];

        cityModal.value = data.city;
        countryModal.value = data.country;
        budgetModal.value = data.budget;
        dateStartModal.value = data.dateStart;
        dateEndModal.value = data.dateEnd;
        personsModal.value = (data.persons)?data.persons:'Choose...';
        mainTransferModal.value = (data.mainTransfer)?data.mainTransfer:'Choose...';
        editTravelForm.dataset.index = index;
    }

    const addEditOnClickListener = function (editButton) {
        editButton.onclick = editElement;
    }

    function setEditButton() {
        const editButtons = document.querySelectorAll(".edit-btn");
        editButtons.forEach(addEditOnClickListener);
    }

    function itemsRender() {
        const items = getDatabase().map(setItem);
        historyItems.innerHTML = items.join('');
        setDeleteButton();
        setEditButton();
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
    editTravelForm.onsubmit = saveChanges;
    clearData.onclick = clearDatabase;
    itemsRender();
})()