document.addEventListener('DOMContentLoaded', () => {
    // تعريف العناصر
    const loginButton = document.getElementById('loginButton');
    const searchButton = document.getElementById('searchButton');
    const logoutButton = document.getElementById('logoutButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const searchInput = document.getElementById('searchInput');
    const loginError = document.getElementById('loginError');
    const errorMessage = document.getElementById('errorMessage');
    const noResults = document.getElementById('noResults');
    const loading = document.getElementById('loading');
    const employeeDetails = document.getElementById('employeeDetails');
    const detailsContent = document.getElementById('detailsContent');
    const employeeName = document.getElementById('employeeName');
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');

    // بيانات الموظفين
    let employeesData = [];

    // حدث تسجيل الدخول
    loginButton.addEventListener('click', async () => {
        try {
            // إظهار حالة التحميل
            loginText.style.display = 'none';
            loginSpinner.style.display = 'inline-block';
            loginButton.disabled = true;
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            // التحقق من إدخال البيانات
            if (!username || !password) {
                throw new Error('يرجى إدخال اسم المستخدم وكلمة المرور');
            }
            
            // تنفيذ المصادقة
            const isAuthenticated = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        const result = auth.authenticate(username, password);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                }, 800);
            });
            
            if (isAuthenticated) {
                // إخفاء رسائل الخطأ
                loginError.style.display = 'none';
                
                // تبديل الواجهات
                loginContainer.style.display = 'none';
                mainContainer.style.display = 'block';
                
                // تحميل بيانات الموظفين
                const { success, error } = await data.loadEmployeeData();
                employeesData = data.getEmployees();
                
                if (!success) {
                    errorMessage.textContent = error || 'تم تحميل بيانات تجريبية';
                    errorMessage.style.display = 'block';
                }
            }
        } catch (error) {
            // عرض رسالة الخطأ
            loginError.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`;
            loginError.style.display = 'flex';
            
            // تأثير الاهتزاز
            usernameInput.classList.add('shake');
            passwordInput.classList.add('shake');
            setTimeout(() => {
                usernameInput.classList.remove('shake');
                passwordInput.classList.remove('shake');
            }, 500);
            
            console.error('فشل تسجيل الدخول:', error);
        } finally {
            // إعادة تعيين حالة الزر
            loginText.style.display = 'inline-block';
            loginSpinner.style.display = 'none';
            loginButton.disabled = false;
        }
    });

    // حدث البحث
    searchButton.addEventListener('click', async () => {
        try {
            // إخفاء الرسائل السابقة
            errorMessage.style.display = 'none';
            noResults.style.display = 'none';
            employeeDetails.style.display = 'none';
            
            // إظهار حالة التحميل
            loading.style.display = 'flex';
            
            // الحصول على قيمة البحث
            const searchTerm = searchInput.value.trim();
            const cleanId = searchTerm.replace(/\D/g, '');
            
            // التحقق من صحة الإدخال
            if (cleanId.length < 8) {
                throw new Error('الرجاء إدخال 8 أرقام على الأقل');
            }
            
            // محاكاة تأخير الشبكة
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // البحث في البيانات
            const employee = data.searchEmployee(searchTerm);
            
            if (employee) {
                  // عرض جميع بيانات الموظف
            ui.displayEmployeeDetails(employee);
        } else {
            throw new Error('لا توجد بيانات مطابقة للرقم الوطني المدخل');
            }
                // عرض النتائج
                employeeName.textContent = employee['الاسم والنسبة'] || 'بيانات الموظف';
                detailsContent.innerHTML = '';
                
                // إضافة الحقول المتاحة
                ['الرقم الوطني', 'التخصص', 'الجهة' ,'الرقم الذاتي' ,'الولادة والتاريخ' ,'المواليد / اليوم' ,'المواليد / عام' ,'مسمى وظيفي'].forEach(field => {
                    if (employee[field]) {
                        const row = document.createElement('div');
                        row.className = 'detail-row';
                        row.innerHTML = `
                            <div class="detail-label">${field}:</div>
                            <div class="detail-value">${employee[field]}</div>
                        `;
                        detailsContent.appendChild(row);
                    }
                });
                
                employeeDetails.style.display = 'block';
            } else {
                throw new Error('لا توجد بيانات مطابقة للرقم الوطني المدخل');
            }
        } catch (error) {
            // عرض رسالة الخطأ المناسبة
            if (error.message.includes('8 أرقام')) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            } else {
                noResults.textContent = error.message;
                noResults.style.display = 'block';
            }
            
            console.error('خطأ في البحث:', error);
        } finally {
            // إخفاء حالة التحميل
            loading.style.display = 'none';
        }
    });

    // حدث تسجيل الخروج
    logoutButton.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            window.location.reload();
        }
    });

    // التحقق من صحة الإدخال أثناء الكتابة
    searchInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length >= 8) {
            errorMessage.style.display = 'none';
        }
    });

    // البحث عند الضغط على Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    // التركيز على حقل اسم المستخدم عند التحميل
    usernameInput.focus();
});
