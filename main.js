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
            loginText.style.display = 'none';
            loginSpinner.style.display = 'inline-block';
            loginButton.disabled = true;

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                throw new Error('يرجى إدخال اسم المستخدم وكلمة المرور');
            }

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
                loginError.style.display = 'none';
                loginContainer.style.display = 'none';
                mainContainer.style.display = 'block';

                const { success, error } = await data.loadEmployeeData();
                employeesData = data.getEmployees();

                if (!success) {
                    errorMessage.textContent = error || 'تم تحميل بيانات تجريبية';
                    errorMessage.style.display = 'block';
                }
            }
        } catch (error) {
            loginError.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`;
            loginError.style.display = 'flex';

            usernameInput.classList.add('shake');
            passwordInput.classList.add('shake');
            setTimeout(() => {
                usernameInput.classList.remove('shake');
                passwordInput.classList.remove('shake');
            }, 500);
        } finally {
            loginText.style.display = 'inline-block';
            loginSpinner.style.display = 'none';
            loginButton.disabled = false;
        }
    });

    // حدث البحث
    searchButton.addEventListener('click', async () => {
        try {
            errorMessage.style.display = 'none';
            noResults.style.display = 'none';
            employeeDetails.style.display = 'none';
            loading.style.display = 'flex';

            const searchTerm = searchInput.value.trim();
            const cleanId = searchTerm.replace(/\D/g, '');

            if (cleanId.length < 8) {
                throw new Error('الرجاء إدخال 8 أرقام على الأقل');
            }

            await new Promise(resolve => setTimeout(resolve, 800));

            const employee = data.searchEmployee(searchTerm);

            if (employee) {
                employeeName.textContent = employee['الاسم والنسبة'] || 'بيانات الموظف';
                detailsContent.innerHTML = '';

                const fieldsToDisplay = [
                    "الاسم والنسبة", "الاسم", "النسبة", "اسم الأب", "اسم الأم",
                    "الولادة والتاريخ", "المواليد / اليوم", "المواليد / شهر", "المواليد / عام",
                    "الرقم الوطني", "الرقم الذاتي", "القيد والخانة", "الجهة", "الشهادة",
                    "التخصص", "مسمى وظيفي", "الدرجة", "تاريخ التعيين", "الحالة الوظيفية"
                ];

                fieldsToDisplay.forEach(field => {
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
            if (error.message.includes('8 أرقام')) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            } else {
                noResults.textContent = error.message;
                noResults.style.display = 'block';
            }
        } finally {
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
    searchInput.addEventListener('input', function () {
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

    // تركيز المؤشر عند التحميل
    usernameInput.focus();
});
