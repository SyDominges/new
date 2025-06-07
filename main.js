// تعريف المتغيرات العامة
let allEmployees = [];

document.addEventListener('DOMContentLoaded', () => {
    // أحداث تسجيل الدخول
    UI_ELEMENTS.loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
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
            
            if (auth.authenticate(username, password)) {
                ui.hideError(ui.elements.loginError);
                ui.elements.loginContainer.style.display = 'none';
                ui.elements.mainContainer.style.display = 'block';
                
                // تحميل بيانات الموظفين
                const { success, error } = await data.loadEmployeeData();
                if (!success) {
                    ui.showError(ui.elements.errorMessage, error || 'تم تحميل بيانات تجريبية بسبب خطأ في الاتصال');
                }
                
                // تخزين البيانات المحملة
                allEmployees = data.getSampleData();
                if (success) {
                    allEmployees = window.allEmployees || data.getSampleData();
                }
            }
        } catch (error) {
            ui.showError(ui.elements.loginError, error.message);
            ui.shakeElement(ui.elements.username);
            ui.shakeElement(ui.elements.password);
        } finally {
            ui.toggleLoginButton(false);
        }
    });
    
    // أحداث البحث
    UI_ELEMENTS.searchButton.addEventListener('click', async () => {
        const searchTerm = UI_ELEMENTS.searchInput.value.trim();
        const cleanId = searchTerm.replace(/\D/g, '');
        
        if (cleanId.length < 8) {
            ui.showError(ui.elements.errorMessage, 'الرجاء إدخال 8 أرقام على الأقل');
            ui.shakeElement(ui.elements.searchInput);
            return;
        }
        
        // إخفاء الرسائل السابقة
        ui.hideError(ui.elements.errorMessage);
        ui.hideError(ui.elements.noResults);
        ui.elements.employeeDetails.style.display = 'none';
        ui.showLoading(true);
        
        try {
            // التحقق من تحميل البيانات
            if (allEmployees.length === 0) {
                const { success } = await data.loadEmployeeData();
                if (!success) {
                    ui.showError(ui.elements.errorMessage, 'جاري استخدام بيانات تجريبية');
                }
            }
            
            // إعطاء وقت كافي لعرض رسالة التحميل
            await new Promise(resolve => setTimeout(resolve, 800));
            
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
    
    // أحداث أخرى
    UI_ELEMENTS.logoutButton.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            auth.logout();
        }
    });
    
    // التحقق من صحة الإدخال أثناء الكتابة
    UI_ELEMENTS.searchInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length >= 8) {
            ui.hideError(ui.elements.errorMessage);
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
