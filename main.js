document.addEventListener('DOMContentLoaded', () => {
    // تعريف العناصر
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');

    // حدث النقر على زر الدخول
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
                
                // تحميل البيانات (اختياري)
                console.log('تم تسجيل الدخول بنجاح');
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

    // التركيز على حقل اسم المستخدم عند التحميل
    usernameInput.focus();
});
