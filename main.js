document.addEventListener('DOMContentLoaded', () => {
    // أحداث تسجيل الدخول
    UI_ELEMENTS.loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            showError(UI_ELEMENTS.loginError, 'يرجى إدخال اسم المستخدم وكلمة المرور');
            shakeElement(UI_ELEMENTS.username);
            shakeElement(UI_ELEMENTS.password);
            return;
        }
        
        try {
            toggleLoginButton(true);
            
            // محاكاة تأخير الشبكة
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (authenticate(username, password)) {
                hideError(UI_ELEMENTS.loginError);
                UI_ELEMENTS.loginContainer.style.display = 'none';
                UI_ELEMENTS.mainContainer.style.display = 'block';
                
                // تحميل بيانات الموظفين
                const { success, error } = await loadEmployeeData();
                if (!success) {
                    showError(UI_ELEMENTS.errorMessage, error || 'تم تحميل بيانات تجريبية بسبب خطأ في الاتصال');
                }
            }
        } catch (error) {
            showError(UI_ELEMENTS.loginError, error.message);
            shakeElement(UI_ELEMENTS.username);
            shakeElement(UI_ELEMENTS.password);
        } finally {
            toggleLoginButton(false);
        }
    });
    
    // أحداث البحث
    UI_ELEMENTS.searchButton.addEventListener('click', async () => {
        const searchTerm = UI_ELEMENTS.searchInput.value.trim();
        const cleanId = searchTerm.replace(/\D/g, '');
        
        if (cleanId.length < 8) {
            showError(UI_ELEMENTS.errorMessage, 'الرجاء إدخال 8 أرقام على الأقل');
            shakeElement(UI_ELEMENTS.searchInput);
            return;
        }
        
        // التحقق من تحميل البيانات
        if (allEmployees.length === 0) {
            const { success } = await loadEmployeeData();
            if (!success) {
                showError(UI_ELEMENTS.errorMessage, 'فشل تحميل بيانات الموظفين');
                return;
            }
        }
        
        hideError(UI_ELEMENTS.errorMessage);
        hideError(UI_ELEMENTS.noResults);
        UI_ELEMENTS.employeeDetails.style.display = 'none';
        showLoading(true);
        
        // محاكاة تأخير البحث
        setTimeout(() => {
            showLoading(false);
            const employee = searchEmployee(searchTerm);
            
            if (employee) {
                displayEmployeeDetails(employee);
            } else {
                showError(UI_ELEMENTS.noResults, 'لا توجد بيانات مطابقة للرقم الوطني المدخل');
            }
        }, 800);
    });
    
    // أحداث أخرى
    UI_ELEMENTS.logoutButton.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            logout();
        }
    });
    
    // التحقق من صحة الإدخال أثناء الكتابة
    UI_ELEMENTS.searchInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length >= 8) {
            hideError(UI_ELEMENTS.errorMessage);
        }
    });
    
    // السماح بالبحث عند الضغط على Enter
    UI_ELEMENTS.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            UI_ELEMENTS.searchButton.click();
        }
    });
    
    // التركيز على حقل اسم المستخدم عند التحميل
    UI_ELEMENTS.username.focus();
});
