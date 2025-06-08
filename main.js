document.addEventListener('DOMContentLoaded', () => {
    // بيانات التطبيق
    let employeesData = [];
    let isAuthenticated = false;

    // ========== أحداث تسجيل الدخول ==========
    UI_ELEMENTS.loginButton.addEventListener('click', async () => {
        const username = UI_ELEMENTS.username.value.trim();
        const password = UI_ELEMENTS.password.value.trim();
        
        // التحقق من إدخال البيانات
        if (!username || !password) {
            ui.showError(ui.elements.loginError, 'يرجى إدخال اسم المستخدم وكلمة المرور');
            ui.shakeElement(ui.elements.username);
            ui.shakeElement(ui.elements.password);
            return;
        }
        
        try {
            ui.toggleLoginButton(true);
            
            // محاكاة تأخير الشبكة
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // تنفيذ المصادقة
            isAuthenticated = auth.authenticate(username, password);
            
            if (isAuthenticated) {
                ui.hideError(ui.elements.loginError);
                ui.elements.loginContainer.style.display = 'none';
                ui.elements.mainContainer.style.display = 'block';
                
                // تحميل بيانات الموظفين
                const { success, error } = await data.loadEmployeeData();
                employeesData = data.getEmployees();
                
                if (!success) {
                    ui.showError(ui.elements.errorMessage, error || 'تم تحميل بيانات تجريبية بسبب خطأ في الاتصال');
                }
                
                console.log('تم تحميل بيانات', employeesData.length, 'موظف');
            }
        } catch (error) {
            ui.showError(ui.elements.loginError, error.message);
            ui.shakeElement(ui.elements.username);
            ui.shakeElement(ui.elements.password);
        } finally {
            ui.toggleLoginButton(false);
        }
    });
    
    // ========== أحداث البحث ==========
    UI_ELEMENTS.searchButton.addEventListener('click', async () => {
        const searchTerm = UI_ELEMENTS.searchInput.value.trim();
        const cleanId = searchTerm.replace(/\D/g, '');
        
        // التحقق من صحة الإدخال
        if (cleanId.length < 8) {
            ui.showError(ui.elements.errorMessage, 'الرجاء إدخال 8 أرقام على الأقل');
            ui.shakeElement(ui.elements.searchInput);
            return;
        }
        
        // التحقق من تحميل البيانات
        if (employeesData.length === 0) {
            const { success } = await data.loadEmployeeData();
            employeesData = data.getEmployees();
            if (!success) {
                ui.showError(ui.elements.errorMessage, 'جاري استخدام بيانات تجريبية');
            }
        }
        
        // إعداد واجهة البحث
        ui.hideError(ui.elements.errorMessage);
        ui.hideError(ui.elements.noResults);
        ui.elements.employeeDetails.style.display = 'none';
        ui.showLoading(true);
        
        try {
            // محاكاة تأخير البحث
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // تنفيذ البحث
            const employee = data.searchEmployee(searchTerm);
            
            if (employee) {
                ui.displayEmployeeDetails(employee);
            } else {
                ui.showError(ui.elements.noResults, 'لا توجد بيانات مطابقة للرقم الوطني المدخل');
            }
        } catch (error) {
            ui.showError(ui.elements.errorMessage, 'حدث خطأ أثناء البحث: ' + error.message);
        } finally {
            ui.showLoading(false);
        }
    });
    
    // ========== أحداث أخرى ==========
    // تسجيل الخروج
    UI_ELEMENTS.logoutButton.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            window.location.reload();
        }
    });
    
    // البحث عند الضغط على Enter
    UI_ELEMENTS.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            UI_ELEMENTS.searchButton.click();
        }
    });
    
    // التحقق من صحة الإدخال أثناء الكتابة
    UI_ELEMENTS.searchInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length >= 8) {
            ui.hideError(ui.elements.errorMessage);
        }
    });
    
    // التركيز على حقل اسم المستخدم عند التحميل
    UI_ELEMENTS.username.focus();
});
