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
function showLoading(show) {
    if (show) {
        UI_ELEMENTS.loading.style.display = 'flex';
    } else {
        UI_ELEMENTS.loading.style.display = 'none';
    }
}

// عرض رسالة خطأ
function showError(element, message) {
    element.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    element.style.display = 'flex';
    element.classList.add('fade-in');
    setTimeout(() => element.classList.add('show'), 10);
}

// إخفاء رسالة خطأ
function hideError(element) {
    element.classList.remove('show');
    setTimeout(() => {
        element.style.display = 'none';
        element.classList.remove('fade-in');
    }, 300);
}

// عرض تفاصيل الموظف
function displayEmployeeDetails(employee) {
    // مسح المحتوى السابق
    UI_ELEMENTS.detailsContent.innerHTML = '';
    
    // عرض اسم الموظف
    UI_ELEMENTS.employeeName.innerHTML = `<i class="fas fa-user-tie"></i> ${employee['الاسم والنسبة'] || 'بيانات الموظف'}`;
    
    // قائمة الحقول المطلوبة
    const fieldsToShow = [
        'الرقم الوطني', 'التخصص', 'الجهة', 
        'الدرجة', 'تاريخ التعيين', 'الحالة الوظيفية'
    ];
    
    // إضافة الحقول المتاحة
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
    
    // إذا لم توجد بيانات، عرض رسالة
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
    
    // عرض قسم التفاصيل
    UI_ELEMENTS.employeeDetails.style.display = 'block';
    UI_ELEMENTS.employeeDetails.classList.add('fade-in');
}

// اهتزاز العنصر للإشارة إلى خطأ
function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
}

// تبديل حالة زر الدخول
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
