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
    detailsContent: document.getElementById('detailsContent'),
    loginText: document.getElementById('loginText'),
    loginSpinner: document.getElementById('loginSpinner')
};

function showLoading(show) {
    UI_ELEMENTS.loading.style.display = show ? 'flex' : 'none';
}

function showError(element, message) {
    element.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    element.style.display = 'flex';
    element.classList.add('fade-in');
}

function hideError(element) {
    element.style.display = 'none';
    element.classList.remove('fade-in');
}

// ... (بقية الكود يبقى كما هو)

function displayEmployeeDetails(employee) {
    UI_ELEMENTS.employeeName.textContent = employee['الاسم والنسبة'] || 'بيانات الموظف';
    UI_ELEMENTS.detailsContent.innerHTML = '';
    
    // قائمة بجميع الحقول المطلوبة
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
    
    // إضافة جميع الحقول المتاحة
    fieldsToShow.forEach(field => {
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
    
    // إذا لم توجد بيانات، عرض رسالة
    if (UI_ELEMENTS.detailsContent.children.length === 0) {
        const noDataRow = document.createElement('div');
        noDataRow.className = 'detail-row';
        noDataRow.innerHTML = `
            <div class="detail-value" style="width:100%; text-align:center; color:#666;">
                لا توجد بيانات متاحة لهذا الموظف
            </div>
        `;
        UI_ELEMENTS.detailsContent.appendChild(noDataRow);
    }
    
    UI_ELEMENTS.employeeDetails.style.display = 'block';
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
