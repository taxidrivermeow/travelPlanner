(() => {
    const city = document.getElementById('city');
    const country = document.getElementById('country');
    const budget = document.getElementById('budget');
    const dateStart = document.getElementById('date-start');
    const dateEnd = document.getElementById('date-end');
    const persons = document.getElementById('persons');
    const mainTransfer = document.getElementById('main-transfer');

    const cityModal = document.getElementById('modal-city');
    const countryModal = document.getElementById('modal-country');
    const budgetModal = document.getElementById('modal-budget');
    const dateStartModal = document.getElementById('modal-date-start');
    const dateEndModal = document.getElementById('modal-date-end');
    const personsModal = document.getElementById('modal-persons');
    const mainTransferModal = document.getElementById('modal-main-transfer');

    const travelForm = document.getElementById('travel-form');
    const editTravelForm = document.getElementById('edit-travel-form');
    const historyItems = document.getElementById('items');
    const modalDetailsDiv = document.getElementById('modal-details');
    const sortType = document.getElementById('sort_type');
    const sortDirection = document.getElementById('sort_direction');
    const clearData = document.getElementById('clear-data');

    const setItem = (obj, index) => {
        const persons = (Number(obj.persons) === 1) ? 'person' : 'persons';
        return `
        <div class="history-item">
            <div class="title">
                <div class="cities">
                    <h4>From Haifa to ${obj.city}/${obj.country}</h4>
                </div>
                <div class="buttons">
                    <a href="#" class="edit-btn" data-index="${index}" data-toggle="modal" data-target="#travelModalLong" title="Edit"><i class="bi bi-pencil-square"></i></a>
                    <a href="#" class="delete-btn" data-index="${index}" title="Delete"><i class="bi bi-x-circle"></i></a>
                    <a href="#" class="details-btn" data-index="${index}" data-toggle="modal" data-target="#detailsModal" title="Details"><i class="bi bi-three-dots-vertical"></i></a>
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

    const itemsRender = () => {
        const items = getDatabase().map(setItem);
        historyItems.innerHTML = items.join('');
        setDeleteButton();
        setEditButton();
        setDetailButton();
    }

    const addRecord = (e) => {
        e.preventDefault();
        const data = getDatabase();
        let newObj = {};
        newObj.city = city.value;
        newObj.country = country.value;
        newObj.budget = budget.value;
        newObj.dateStart = dateStart.value;
        newObj.dateEnd = dateEnd.value;
        newObj.persons = (persons.value === 'Choose...') ? '' : persons.value;
        newObj.mainTransfer = (mainTransfer.value === 'Choose...') ? '' : mainTransfer.value;
        newObj.addDate = Date.now();
        data.unshift(newObj);
        setDatabase(data);

        e.currentTarget.reset();
        itemsRender();
    }

    const deleteElement = (e) => {
        let data = getDatabase();
        data.splice(Number(e.currentTarget.dataset.index), 1);
        setDatabase(data);

        itemsRender();
    }

    const addDeleteOnClickListener = (deleteButton) => {
        deleteButton.addEventListener('click', deleteElement);
    }

    const setDeleteButton = () => {
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(addDeleteOnClickListener);
    }

    const currentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear()
        const month = ((currentDate.getMonth() + 1) < 10) ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
        const date = (currentDate.getDate() < 10) ? '0' + currentDate.getDate() : currentDate.getDate();
        const hours = (currentDate.getHours() < 10) ? '0' + currentDate.getHours() : currentDate.getHours();
        const minutes = (currentDate.getMinutes() < 10) ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
        const seconds = (currentDate.getSeconds() < 10) ? '0' + currentDate.getSeconds() : currentDate.getSeconds();
        return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    }

    const saveChanges = (e) => {
        e.preventDefault();
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
            changeHistory += (newData.city !== data[index].city) ? `City: ${data[index].city} => ${newData.city}<br>` : '';
            changeHistory += (newData.country !== data[index].country) ? `Country: ${data[index].country} => ${newData.country}<br>` : '';
            changeHistory += (newData.budget !== data[index].budget) ? `Budget: ${data[index].budget} => ${newData.budget}<br>` : '';
            changeHistory += (newData.dateStart !== data[index].dateStart) ? `Date start: ${data[index].dateStart} => ${newData.dateStart}<br>` : '';
            changeHistory += (newData.dateEnd !== data[index].dateEnd) ? `Date end: ${data[index].dateEnd} => ${newData.dateEnd}<br>` : '';
            changeHistory += (newData.persons !== data[index].persons) ? `Persons: ${data[index].persons} => ${newData.persons}<br>` : '';
            changeHistory += (newData.mainTransfer !== data[index].mainTransfer) ? `Transfer: ${data[index].mainTransfer} => ${newData.mainTransfer}<br>` : '';

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

    const editElement = (e) => {
        const index = e.currentTarget.dataset.index;
        const data = getDatabase()[index];

        cityModal.value = data.city;
        countryModal.value = data.country;
        budgetModal.value = data.budget;
        dateStartModal.value = data.dateStart;
        dateEndModal.value = data.dateEnd;
        personsModal.value = (data.persons) ? data.persons : 'Choose...';
        mainTransferModal.value = (data.mainTransfer) ? data.mainTransfer : 'Choose...';
        editTravelForm.dataset.index = index;
    }

    const addEditOnClickListener = (editButton) => {
        editButton.addEventListener('click', editElement);
    }

    const setEditButton = () => {
        const editButtons = document.querySelectorAll(".edit-btn");
        editButtons.forEach(addEditOnClickListener);
    }

    const detailsElement = (e) => {
        const index = e.currentTarget.dataset.index;
        const data = getDatabase()[index];
        let changeLog = '';
        const travelInfo = `
        <b>Country:</b> ${data.country}<br>
        <b>City:</b> ${data.city}<br>
        <b>Expected budget:</b> ${data.budget}<br>
        <b>Date start:</b> ${data.dateStart}<br>
        <b>Date end:</b> ${data.dateEnd}<br>
        <b>Persons:</b> ${data.persons}<br>
        <b>Main transfer:</b> ${data.mainTransfer}<br>
        `;

        if (data.changeLog) {
            changeLog = data.changeLog.map(function (value) {
                return `${value} <br>`;
            }).join('');
            changeLog = '<hr><h6>Changelog:</h6>' + changeLog;
        }

        modalDetailsDiv.innerHTML = travelInfo + changeLog;
    }

    const addDetailsOnClickListener = (detailsButton) => {
        detailsButton.addEventListener('click', detailsElement);
    }

    const setDetailButton = () => {
        const detailsButtons = document.querySelectorAll(".details-btn");
        detailsButtons.forEach(addDetailsOnClickListener);
    }

    const sortDatabase = () => {
        const data = getDatabase();
        const sortBy = sortType.value;
        let direction = 'DESC';
        let sortParam;
        let sortedData;

        if (sortBy === 'budget') {
            sortParam = 'budget';
        } else if (sortBy === 'date') {
            sortParam = 'dateStart';
        } else if (sortBy === 'persons') {
            sortParam = 'persons';
        } else {
            sortParam = 'addDate';
        }
        direction = (sortDirection.classList.contains('bi-sort-up'))?'ASC':'DESC';

        sortedData = data.sort((a, b) => {
            let compareRes;
            if (sortParam === 'dateStart') {
                compareRes = (direction === 'ASC')? Date.parse(a[sortParam]) - Date.parse(b[sortParam]) : Date.parse(b[sortParam]) - Date.parse(a[sortParam]);
            } else {
                compareRes = (direction === 'ASC')? a[sortParam] - b[sortParam] : b[sortParam] - a[sortParam];
            }
            return compareRes;
        });
        setDatabase(sortedData);
        itemsRender();
    }

    const changeSortDirection = () => {
        sortDirection.classList.toggle("bi-sort-up");
        sortDirection.classList.toggle("bi-sort-down");
        sortDatabase();
    }

    const getDatabase = () => {
        return (localStorage.getItem('travels')) ? JSON.parse(localStorage.getItem('travels')) : [];
    }

    const setDatabase = (data) => {
        localStorage.setItem("travels", JSON.stringify(data));
    }

    const clearDatabase = () => {
        localStorage.setItem("travels", "");
        itemsRender();
    }

    travelForm.addEventListener('submit', addRecord);
    editTravelForm.addEventListener('submit', saveChanges);
    sortType.addEventListener('change', sortDatabase);
    sortDirection.addEventListener('click', changeSortDirection);
    clearData.addEventListener('click', clearDatabase);
    itemsRender();
})()