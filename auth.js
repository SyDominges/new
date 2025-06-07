// تكوين المصادقة
const AUTH_CONFIG = {
    USERNAME_HASH: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // admin
    PASSWORD_HASH: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // admin
    MAX_ATTEMPTS: 3,
    LOCK_TIME: 30000, // 30 ثانية
    SESSION_TIMEOUT: 1800000 // 30 دقيقة
};

let failedAttempts = 0;
let lastAttemptTime = 0;
let sessionTimeout;

// التحقق من صحة بيانات الدخول
function authenticate(username, password) {
    if (typeof CryptoJS === 'undefined') {
        throw new Error('مكتبة التشفير غير متوفرة');
    }

    const currentTime = Date.now();
    
    // التحقق من تأمين الحساب
    if (failedAttempts >= AUTH_CONFIG.MAX_ATTEMPTS) {
        const remainingTime = AUTH_CONFIG.LOCK_TIME - (currentTime - lastAttemptTime);
        if (remainingTime > 0) {
            throw new Error(`تم تجاوز عدد المحاولات. الرجاء الانتظار ${Math.ceil(remainingTime/1000)} ثانية`);
        } else {
            failedAttempts = 0; // إعادة تعيين بعد انتهاء الوقت
        }
    }

    const hashedUsername = CryptoJS.SHA256(username).toString();
    const hashedPassword = CryptoJS.SHA256(password).toString();

    if (hashedUsername === AUTH_CONFIG.USERNAME_HASH && 
        hashedPassword === AUTH_CONFIG.PASSWORD_HASH) {
        failedAttempts = 0;
        startSessionTimer();
        return true;
    }

    failedAttempts++;
    lastAttemptTime = currentTime;
    throw new Error(`بيانات الدخول غير صحيحة. المحاولات المتبقية: ${AUTH_CONFIG.MAX_ATTEMPTS - failedAttempts}`);
}

// بدء مؤقت الجلسة
function startSessionTimer() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        if (confirm('انتهت مدة الجلسة. هل ترغب في تمديدها؟')) {
            startSessionTimer();
        } else {
            logout();
        }
    }, AUTH_CONFIG.SESSION_TIMEOUT);
}

// تسجيل الخروج
function logout() {
    clearTimeout(sessionTimeout);
    window.location.reload();
}

// التحقق من تأمين الحساب
function isAccountLocked() {
    return failedAttempts >= AUTH_CONFIG.MAX_ATTEMPTS && 
           (Date.now() - lastAttemptTime) < AUTH_CONFIG.LOCK_TIME;
}

// الحصول على المحاولات المتبقية
function getRemainingAttempts() {
    return AUTH_CONFIG.MAX_ATTEMPTS - failedAttempts;
}

// تصدير الدوال
window.auth = {
    authenticate,
    logout,
    isAccountLocked,
    getRemainingAttempts
};
