// عناصر واجهة المستخدم
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

// عرض/إخفاء تحميل
const showLoading = (show) => {
    if (show) {
        UI_ELEMENTS.loading.style.display = 'flex';
        UI_ELEMENTS.loading.classList.add('fade-in');
    } else {
        UI_ELEMENTS.loading.style.display = 'none';
        UI_ELEMENTS.loading.classList.remove('fade-in');
    }
};

// عرض رسالة خطأ
const showError = (element, message) => {
    element.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    element.style.display = 'flex';
    element.classList.add('fade-in');
};

// إخفاء رسالة خطأ
const hideError = (element) => {
    element.style.display = 'none';
    element.classList.remove('fade-in');
};

// عرض تفاصيل الموظف
const displayEmployeeDetails = (employee) => {
    UI_ELEMENTS.employeeName.innerHTML = `<i class="fas fa-user-tie"></i> ${employee['الاسم والنسبة'] || 'بيانات الموظف'}`;
    UI_ELEMENTS.detailsContent.innerHTML = '';
    
    const fieldsToShow = [
        'الرقم الوطني', 'التخصص', 'الجهة', 
        'الدرجة', 'تاريخ التعيين', 'الحالة الوظيفية'
    ];
    
    fieldsToShow.forEach(field => {
        if (employee[field]) {
            const row = document.createElement('div');
            row.className = 'detail-row fade-in';
            
            row.innerHTML = `
                <div class="detail-label">${field}:</div>
                <div class="detail-value">${employee[field]}</div>
            `;
            
            UI_ELEMENTS.detailsContent.appendChild(row);
        }
    });
    
    UI_ELEMENTS.employeeDetails.style.display = 'block';
    UI_ELEMENTS.employeeDetails.classList.add('fade-in');
};

// اهتزاز العنصر للإشارة إلى خطأ
const shakeElement = (element) => {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
};

// تبديل حالة زر الدخول
const toggleLoginButton = (isLoading) => {
    if (isLoading) {
        UI_ELEMENTS.loginText.style.display = 'none';
        UI_ELEMENTS.loginSpinner.style.display = 'inline-block';
        UI_ELEMENTS.loginButton.disabled = true;
    } else {
        UI_ELEMENTS.loginText.style.display = 'inline-block';
        UI_ELEMENTS.loginSpinner.style.display = 'none';
        UI_ELEMENTS.loginButton.disabled = false;
    }
};

// تصدير الدوال
window.ui = {
    showLoading,
    showError,
    hideError,
    displayEmployeeDetails,
    shakeElement,
    toggleLoginButton,
    elements: UI_ELEMENTS
};
