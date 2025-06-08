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

    // دالة لتنظيف النصوص غير معروفة (اختياري)
    function clean(text) {
        return text ? text.trim() : '-';
    }

    // دالة لتحويل التاريخ من yyyy-mm-dd إلى dd/mm/yyyy (أو حسب الحاجة)
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date)) return dateString; // لو التاريخ غير صالح يرجع النص كما هو
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

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

            console.error('فشل تسجيل الدخول:', error);
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
                // استخراج الاسم الكامل
                const fullName = employee['الاسم والنسبة'] || 'بيانات الموظف';

                // تحضير بعض الحقول للعرض
                const birthDate = formatDate(employee['تاريخ الميلاد']);
                const motherName = clean(employee['اسم الأم']);
                const natId = clean(employee['الرقم الوطني']);
                const selfId = clean(employee['الرقم الذاتي']);
                const registry = clean(employee['القيد والخانة']);
                const entity = clean(employee['الجهة']);
                const degree = clean(employee['الشهادة']);
                const specialty = clean(employee['التخصص']);
                const jobTitle = clean(employee['مسمى وظيفي']);

                employeeName.textContent = fullName;

                detailsContent.innerHTML = `
                    <div class="employee-card">
                        <h2>${fullName}</h2>
                        <div class="main-info">
                            <p><strong>اسم الأم:</strong> ${motherName}</p>
                            <p><strong>تاريخ الميلاد:</strong> ${birthDate}</p>
                        </div>
                        <hr>
                        <div class="extra-info">
                            <p><strong>الرقم الوطني:</strong> ${natId}</p>
                            <p><strong>الرقم الذاتي:</strong> ${selfId}</p>
                            <p><strong>القيد والخانة:</strong> ${registry}</p>
                            <p><strong>الجهة:</strong> ${entity}</p>
                            <p><strong>الشهادة:</strong> ${degree}</p>
                            <p><strong>التخصص:</strong> ${specialty}</p>
                            <p><strong>مسمى وظيفي:</strong> ${jobTitle}</p>
                        </div>
                        <button id="printButton" class="btn-print">طباعة</button>
                    </div>
                `;

                employeeDetails.style.display = 'block';

                // إضافة حدث طباعة
                const printButton = document.getElementById('printButton');
                printButton.addEventListener('click', () => {
                    window.print();
                });

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

    // التركيز على حقل اسم المستخدم عند التحميل
    usernameInput.focus();
});
