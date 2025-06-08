const UI_ELEMENTS = {
    // عناصر تسجيل الدخول
    loginContainer: document.getElementById('loginContainer'),
    loginButton: document.getElementById('loginButton'),
    loginError: document.getElementById('loginError'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    loginText: document.getElementById('loginText'),
    loginSpinner: document.getElementById('loginSpinner'),
    
    // عناصر الصفحة الرئيسية
    mainContainer: document.getElementById('mainContainer'),
    logoutButton: document.getElementById('logoutButton'),
    searchInput: document.getElementById('searchInput'),
    searchButton: document.getElementById('searchButton'),
    errorMessage: document.getElementById('errorMessage'),
    noResults: document.getElementById('noResults'),
    loading: document.getElementById('loading'),
    employeeDetails: document.getElementById('employeeDetails'),
    employeeName: document.getElementById('employeeName'),
    detailsContent: document.getElementById('detailsContent')
};

function showLoading(show) {
    if (show) {
        UI_ELEMENTS.loading.style.display = 'flex';
        UI_ELEMENTS.loading.classList.add('fade-in');
    } else {
        UI_ELEMENTS.loading.style.display = 'none';
        UI_ELEMENTS.loading.classList.remove('fade-in');
    }
}

function showError(element, message) {
    element.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    element.style.display = 'flex';
    element.classList.add('fade-in');
    setTimeout(() => element.classList.add('show'), 10);
}

function hideError(element) {
    element.classList.remove('show');
    setTimeout(() => {
        element.style.display = 'none';
        element.classList.remove('fade-in');
    }, 300);
}

function displayEmployeeDetails(employee) {
    UI_ELEMENTS.employeeName.innerHTML = `<i class="fas fa-user-tie"></i> ${employee['الاسم والنسبة'] || 'بيانات الموظف'}`;
    UI_ELEMENTS.detailsContent.innerHTML = '';
    
    const fieldsToShow = [
        'الرقم الذاتي',
        'اسم الأم',
        'الولادة والتاريخ',
        'اليوم',
        'الشهر',
        'العام',
        'الشهادة',
        'التخصص',
        'المسمى الوظيفي',
        'الجهة',
        'الدرجة',
        'تاريخ التعيين',
        'الحالة الوظيفية'
    ];
    
    let hasData = false;
    fieldsToShow.forEach(field => {
        if (employee[field]) {
            hasData = true;
            const row = document.createElement('div');
            row.className = 'detail-row fade-in';
            row.innerHTML = `
                <div class="detail-label">${field}:</div>
                <div class="detail-value">${employee[field]}</div>
            `;
            UI_ELEMENTS.detailsContent.appendChild(row);
        }
    });
    
    if (!hasData) {
        const noDataRow = document.createElement('div');
        noDataRow.className = 'detail-row fade-in';
        noDataRow.innerHTML = `
            <div class="detail-value empty-message">
                لا توجد بيانات متاحة لهذا الموظف
            </div>
        `;
        UI_ELEMENTS.detailsContent.appendChild(noDataRow);
    }
    
    UI_ELEMENTS.employeeDetails.style.display = 'block';
    UI_ELEMENTS.employeeDetails.classList.add('fade-in');
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
}

function toggleLoginButton(isLoading) {
    if (isLoading) {
        UI_ELEMENTS.loginText.style.display = 'none';
        UI_ELEMENTS.loginSpinner.style.display = 'inline-block';
        UI_ELEMENTS.loginButton.disabled = true;
    } else {
        UI_ELEMENTS.loginText.style.display = 'inline-block';
        UI_ELEMENTS.loginSpinner.style.display = 'none';
        UI_ELEMENTS.loginButton.disabled = false;
    }
}

window.ui = {
    showLoading,
    showError,
    hideError,
    displayEmployeeDetails,
    shakeElement,
    toggleLoginButton,
    elements: UI_ELEMENTS
};
