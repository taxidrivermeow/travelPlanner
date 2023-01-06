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
    const modalDetailsDiv = document.getElementById('modal-details');

    const setItem = function (obj, index) {
        const persons = (obj.persons == 1) ? 'person' : 'persons';
        return `
        <div class="history-item">
            <div class="title">
                <div class="cities">
                    <h4>From Haifa to ${obj.city}/${obj.country}</h4>
                </div>
                <div class="buttons">
                    <a href="#" class="edit-btn" data-index="${index}" data-toggle="modal" data-target="#travelModalLong" title="Edit"><img src="images/pencil-square.svg" alt="Edit"></a>
                    <a href="#" class="delete-btn" data-index="${index}" title="Delete"><img src="images/x-circle.svg" alt="Delete"></a>
                    <a href="#" class="details-btn" data-index="${index}" data-toggle="modal" data-target="#detailsModal" title="Details"><img src="images/three-dots-vertical.svg" alt="Details"></a>
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

    function currentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear()
        const month = ((currentDate.getMonth() + 1) < 10)?'0' + (currentDate.getMonth() + 1):(currentDate.getMonth() + 1);
        const date = (currentDate.getDate() < 10)?'0' + currentDate.getDate():currentDate.getDate();
        const hours = (currentDate.getHours() < 10)?'0' + currentDate.getHours():currentDate.getHours();
        const minutes = (currentDate.getMinutes() < 10)?'0' + currentDate.getMinutes():currentDate.getMinutes();
        const seconds = (currentDate.getSeconds() < 10)?'0' + currentDate.getSeconds():currentDate.getSeconds();
        return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    }

    function saveChanges(event) {
        event.preventDefault();
        const index = editTravelForm.dataset.index;
        const data = getDatabase();
        let date = currentDate();
        let newData = {...data[index]};

        newData.city = cityModal.value;
        newData.country = countryModal.value;
        newData.budget = budgetModal.value;
        newData.dateStart = dateStartModal.value;
        newData.dateEnd = dateEndModal.value;
        newData.persons = (personsModal.value === 'Choose...') ? '' : personsModal.value;
        newData.mainTransfer = (mainTransferModal.value === 'Choose...') ? '' : mainTransferModal.value;

        if (JSON.stringify(newData) !== JSON.stringify(data[index])) {
            let changeHistory = '';
            changeHistory += (newData.city !== data[index].city)?`City: ${data[index].city} => ${newData.city}<br>`:'';
            changeHistory += (newData.country !== data[index].country)?`Country: ${data[index].country} => ${newData.country}<br>`:'';
            changeHistory += (newData.budget !== data[index].budget)?`Budget: ${data[index].budget} => ${newData.budget}<br>`:'';
            changeHistory += (newData.dateStart !== data[index].dateStart)?`Date start: ${data[index].dateStart} => ${newData.dateStart}<br>`:'';
            changeHistory += (newData.dateEnd !== data[index].dateEnd)?`Date end: ${data[index].dateEnd} => ${newData.dateEnd}<br>`:'';
            changeHistory += (newData.persons !== data[index].persons)? `Persons: ${data[index].persons} => ${newData.persons}<br>`:'';
            changeHistory += (newData.mainTransfer !== data[index].mainTransfer)?`Transfer: ${data[index].mainTransfer} => ${newData.mainTransfer}<br>`:'';

            date = `<hr><b>${date}</b>:<br> ${changeHistory}`;
            if (data[index].changeLog) {
                newData.changeLog.push(date)
            } else {
                newData.changeLog = [date];
            }
        }
        data[index] = newData;

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
    
    function detailsElement() {
        const index = this.dataset.index;
        const data = getDatabase()[index];
        let changeLog = '';
        const travelInfo = `
        Country: ${data.country}<br>
        City: ${data.city}<br>
        Expected budget: ${data.budget}<br>
        Date start: ${data.dateStart}<br>
        Date end: ${data.dateEnd}<br>
        Persons: ${data.persons}<br>
        Main transfer: ${data.mainTransfer}<br>
        `;

        if (data.changeLog) {
            changeLog = data.changeLog.map(function (value){
                return `${value} <br>`;
            }).join('');
            changeLog = '<hr><h6>Changelog:</h6>' + changeLog;
        }

        modalDetailsDiv.innerHTML = travelInfo+changeLog;
    }

    const addDetailsOnClickListener = function (detailsButton) {
        detailsButton.onclick = detailsElement;
    }

    function setDetailButton() {
        const detailsButtons = document.querySelectorAll(".details-btn");
        detailsButtons.forEach(addDetailsOnClickListener);
    }

    function itemsRender() {
        const items = getDatabase().map(setItem);
        historyItems.innerHTML = items.join('');
        setDeleteButton();
        setEditButton();
        setDetailButton();
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