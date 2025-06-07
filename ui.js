const UI_ELEMENTS = {
    loginContainer: document.getElementById('loginContainer'),
    mainContainer: document.getElementById('mainContainer'),
    loginError: document.getElementById('loginError'),
    errorMessage: document.getElementById('errorMessage'),
    noResults: document.getElementById('noResults'),
    loading: document.getElementById('loading'),
    employeeDetails: document.getElementById('employeeDetails'),
    logoutButton: document.getElementById('logoutButton'),
    loginButton: document.getElementById('loginButton'),
    searchButton: document.getElementById('searchButton'),
    searchInput: document.getElementById('searchInput'),
    employeeName: document.getElementById('employeeName'),
    detailsContent: document.getElementById('detailsContent')
};

const showLoading = (show) => {
    UI_ELEMENTS.loading.style.display = show ? 'block' : 'none';
};

const showError = (element, message) => {
    element.textContent = message;
    element.style.display = 'block';
};

const hideError = (element) => {
    element.style.display = 'none';
};

const displayEmployeeDetails = (employee) => {
    UI_ELEMENTS.employeeName.textContent = employee['الاسم والنسبة'] || 'بيانات الموظف';
    UI_ELEMENTS.detailsContent.innerHTML = '';
    
    ['الرقم الوطني', 'التخصص', 'الجهة'].forEach(field => {
        if (employee[field]) {
            const row = document.createElement('div');
            row.className = 'detail-row';
            
            row.innerHTML = `
                <div class="detail-label">${field}:</div>
                <div class="detail-value">${employee[field]}</div>
            `;
            
            UI_ELEMENTS.detailsContent.appendChild(row);
        }
    });
    
    UI_ELEMENTS.employeeDetails.style.display = 'block';
};

const shakeElement = (element) => {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
};
