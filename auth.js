const AUTH_CONFIG = {
    USERNAME_HASH: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // admin
    PASSWORD_HASH: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // admin
    MAX_ATTEMPTS: 3,
    LOCK_TIME: 30000 // 30 ثانية
};

let failedAttempts = 0;
let lastAttemptTime = 0;

function authenticate(username, password) {
    try {
        // التحقق من وجود مكتبة التشفير
        if (typeof CryptoJS === 'undefined') {
            console.error('مكتبة التشفير غير محملة');
            throw new Error('حدث خطأ في النظام. يرجى إعادة المحاولة لاحقاً');
        }

        const currentTime = Date.now();
        
        // التحقق من تأمين الحساب
        if (failedAttempts >= AUTH_CONFIG.MAX_ATTEMPTS) {
            const remainingTime = AUTH_CONFIG.LOCK_TIME - (currentTime - lastAttemptTime);
            if (remainingTime > 0) {
                throw new Error(`تم تجاوز عدد المحاولات. الرجاء الانتظار ${Math.ceil(remainingTime/1000)} ثانية`);
            } else {
                failedAttempts = 0;
            }
        }

        const hashedUsername = CryptoJS.SHA256(username).toString();
        const hashedPassword = CryptoJS.SHA256(password).toString();

        if (hashedUsername === AUTH_CONFIG.USERNAME_HASH && 
            hashedPassword === AUTH_CONFIG.PASSWORD_HASH) {
            failedAttempts = 0;
            return true;
        }

        failedAttempts++;
        lastAttemptTime = currentTime;
        throw new Error(`بيانات الدخول غير صحيحة. المحاولات المتبقية: ${AUTH_CONFIG.MAX_ATTEMPTS - failedAttempts}`);
    } catch (error) {
        console.error('خطأ في المصادقة:', error);
        throw error;
    }
}

window.auth = {
    authenticate
};
