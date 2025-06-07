document.addEventListener('DOMContentLoaded', () => {
    // أحداث تسجيل الدخول
    UI_ELEMENTS.loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            showError(UI_ELEMENTS.loginError, 'يرجى إدخال اسم المستخدم وكلمة المرور');
            return;
        }
        
        try {
            UI_ELEMENTS.loginButton.disabled = true;
            UI_ELEMENTS.loginButton.classList.add('btn-loading');
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (authenticate(username, password)) {
                hideError(UI_ELEMENTS.loginError);
                UI_ELEMENTS.loginContainer.style.display = 'none';
                UI_ELEMENTS.mainContainer.style.display = 'block';
                
                const { success } = await loadEmployeeData();
                if (!success) {
                    showError(UI_ELEMENTS.errorMessage, 'تم تحميل بيانات تجريبية بسبب خطأ في الاتصال');
                }
            }
        } catch (error) {
            showError(UI_ELEMENTS.loginError, error.message);
            shakeElement(document.getElementById('username'));
            shakeElement(document.getElementById('password'));
        } finally {
            UI_ELEMENTS.loginButton.classList.remove('btn-loading');
            UI_ELEMENTS.loginButton.disabled = false;
        }
    });
    
    // أحداث البحث
    UI_ELEMENTS.searchButton.addEventListener('click', () => {
        const searchTerm = UI_ELEMENTS.searchInput.value.trim();
        
        if (searchTerm.replace(/\D/g, '').length < 8) {
            showError(UI_ELEMENTS.errorMessage, 'الرجاء إدخال 8 أرقام على الأقل');
            return;
        }
        
        hideError(UI_ELEMENTS.errorMessage);
        hideError(UI_ELEMENTS.noResults);
        UI_ELEMENTS.employeeDetails.style.display = 'none';
        showLoading(true);
        
        setTimeout(() => {
            showLoading(false);
            const employee = searchEmployee(searchTerm);
            
            if (employee) {
                displayEmployeeDetails(employee);
            } else {
                showError(UI_ELEMENTS.noResults, 'لا توجد بيانات مطابقة');
            }
        }, 800);
    });
    
    // أحداث أخرى
    UI_ELEMENTS.logoutButton.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            location.reload();
        }
    });
    
    UI_ELEMENTS.searchInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length >= 8) {
            hideError(UI_ELEMENTS.errorMessage);
        }
    });
});
