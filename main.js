document.addEventListener('DOMContentLoaded', () => {
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

    let employeesData = [];

    // تابع لطباعة الصفحة
    function printPage() {
        window.print();
    }

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

            console.error('فشل تسجيل الدخول:', error);
        } finally {
            loginText.style.display = 'inline-block';
            loginSpinner.style.display = 'none';
            loginButton.disabled = false;
        }
    });

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
                const clean = str => (str || '').replace(/'/g, '').trim();
                const fullName = `${clean(employee["الاسم"])} ${clean(employee["اسم الأب"])} ${clean(employee["النسبة"])}`;
                const birthDate = `${employee["المواليد / اليوم"]}/${employee["المواليد / شهر"]}/${employee["المواليد / عام"]}`;

                employeeName.innerHTML = `<i class="fas fa-user-tie"></i> ${fullName}`;
                detailsContent.innerHTML = `
                    <div class="employee-card">
                        <div class="main-info">
                            <p><strong>اسم الأم:</strong> ${clean(employee["اسم الأم"])}</p>
                            <p><strong>تاريخ الميلاد:</strong> ${birthDate}</p>
                        </div>
                        <hr>
                        <div class="extra-info">
                            <p><strong>الرقم الوطني:</strong> ${employee["الرقم الوطني"] || '-'}</p>
                            <p><strong>الرقم الذاتي:</strong> ${employee["الرقم الذاتي"] || '-'}</p>
                            <p><strong>القيد والخانة:</strong> ${clean(employee["القيد والخانة"])}</p>
                            <p><strong>الجهة:</strong> ${clean(employee["الجهة"])}</p>
                            <p><strong>الشهادة:</strong> ${clean(employee["الشهادة"])}</p>
                            <p><strong>التخصص:</strong> ${clean(employee["التخصص"])}</p>
                            <p><strong>مسمى وظيفي:</strong> ${clean(employee["مسمى وظيفي"])}</p>
                        </div>
                        <button id="printButton" class="btn btn-print">طباعة</button>
                    </div>
                `;

                employeeDetails.style.display = 'block';

                // تفعيل زر الطباعة
                const printBtn = document.getElementById('printButton');
                printBtn.addEventListener('click', printPage);

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

            console.error('خطأ في البحث:', error);
        } finally {
            loading.style.display = 'none';
        }
    });

    logoutButton.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            window.location.reload();
        }
    });

    searchInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length >= 8) {
            errorMessage.style.display = 'none';
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    usernameInput.focus();
});
