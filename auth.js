const AUTH_CONFIG = {
    USERNAME_HASH: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    PASSWORD_HASH: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    MAX_ATTEMPTS: 3,
    LOCK_TIME: 30000 // 30 ثانية
};

let failedAttempts = 0;

const authenticate = (username, password) => {
    if (failedAttempts >= AUTH_CONFIG.MAX_ATTEMPTS) {
        throw new Error(`تم تجاوز عدد المحاولات. الرجاء الانتظار ${AUTH_CONFIG.LOCK_TIME/1000} ثانية`);
    }

    const hashedUsername = CryptoJS.SHA256(username).toString();
    const hashedPassword = CryptoJS.SHA256(password).toString();

    if (hashedUsername === AUTH_CONFIG.USERNAME_HASH && 
        hashedPassword === AUTH_CONFIG.PASSWORD_HASH) {
        failedAttempts = 0;
        return true;
    }

    failedAttempts++;
    throw new Error(`بيانات الدخول غير صحيحة. المحاولات المتبقية: ${AUTH_CONFIG.MAX_ATTEMPTS - failedAttempts}`);
};

const isAccountLocked = () => {
    return failedAttempts >= AUTH_CONFIG.MAX_ATTEMPTS;
};

const getRemainingAttempts = () => {
    return AUTH_CONFIG.MAX_ATTEMPTS - failedAttempts;
};
