/**
 * تكوينات المصادقة
 * @constant {Object} AUTH_CONFIG
 * @property {string} USERNAME_HASH - هاش اسم المستخدم (SHA256 لـ "admin")
 * @property {string} PASSWORD_HASH - هاش كلمة المرور (SHA256 لـ "admin")
 * @property {number} MAX_ATTEMPTS - الحد الأقصى لمحاولات الدخول الفاشلة
 * @property {number} LOCK_TIME - مدة تأمين الحساب بالمللي ثانية (30 ثانية)
 */
const AUTH_CONFIG = {
    USERNAME_HASH: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // هاش SHA256 لـ "a"
    PASSWORD_HASH: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // هاش SHA256 لـ "a"
    MAX_ATTEMPTS: 3,
    LOCK_TIME: 30000 // 30 ثانية
};

// متغيرات حالة المصادقة
let failedAttempts = 0;
let lastAttemptTime = 0;
let isLocked = false;
let lockTimeout = null;

/**
 * دالة المصادقة الرئيسية
 * @param {string} username - اسم المستخدم المدخل
 * @param {string} password - كلمة المرور المدخلة
 * @returns {boolean} - يعيد true إذا كانت المصادقة ناجحة
 * @throws {Error} - يرمي خطأً مع رسالة توضح سبب الفشل
 */
function authenticate(username, password) {
    // التحقق من حالة تأمين الحساب
    if (isLocked) {
        const remainingTime = Math.ceil((AUTH_CONFIG.LOCK_TIME - (Date.now() - lastAttemptTime)) / 1000);
        throw new Error(`الحساب مؤقتاً مقفل. الرجاء المحاولة بعد ${remainingTime} ثانية`);
    }

    // التحقق من وجود مكتبة التشفير
    if (typeof CryptoJS === 'undefined') {
        throw new Error('نظام التشفير غير متوفر. يرجى إعادة تحميل الصفحة');
    }

    try {
        // حساب الهاش للمدخلات
        const usernameHash = CryptoJS.SHA256(username).toString();
        const passwordHash = CryptoJS.SHA256(password).toString();

        // المقارنة مع بيانات الاعتماد الصحيحة
        if (usernameHash === AUTH_CONFIG.USERNAME_HASH && passwordHash === AUTH_CONFIG.PASSWORD_HASH) {
            resetAuthState(); // إعادة تعيين حالة المصادقة بعد نجاح الدخول
            return true;
        }

        // زيادة عدد المحاولات الفاشلة
        failedAttempts++;
        lastAttemptTime = Date.now();

        // التحقق من وصول المحاولات الفاشلة للحد الأقصى
        if (failedAttempts >= AUTH_CONFIG.MAX_ATTEMPTS) {
            lockAccount();
            throw new Error('تم تجاوز عدد المحاولات المسموحة. تم تأمين الحساب مؤقتاً');
        }

        // حساب المحاولات المتبقية
        const remainingAttempts = AUTH_CONFIG.MAX_ATTEMPTS - failedAttempts;
        throw new Error(`بيانات الدخول غير صحيحة. لديك ${remainingAttempts} محاولة${remainingAttempts > 1 ? 'ات' : ''} متبقية`);
    } catch (error) {
        console.error('خطأ في عملية المصادقة:', error);
        throw error;
    }
}

/**
 * تأمين الحساب مؤقتاً
 */
function lockAccount() {
    isLocked = true;
    lockTimeout = setTimeout(() => {
        resetAuthState();
    }, AUTH_CONFIG.LOCK_TIME);
}

/**
 * إعادة تعيين حالة المصادقة
 */
function resetAuthState() {
    failedAttempts = 0;
    isLocked = false;
    clearTimeout(lockTimeout);
    lockTimeout = null;
}

/**
 * الحصول على حالة المصادقة
 * @returns {Object} - كائن يحتوي على معلومات حالة المصادقة
 */
function getAuthState() {
    return {
        isLocked,
        remainingAttempts: AUTH_CONFIG.MAX_ATTEMPTS - failedAttempts,
        lockRemainingTime: isLocked ? Math.ceil((AUTH_CONFIG.LOCK_TIME - (Date.now() - lastAttemptTime)) / 1000) : 0
    };
}

// تصدير الدوال للاستخدام في ملفات أخرى
window.auth = {
    authenticate,
    getAuthState,
    resetAuthState
};

// إعادة تعيين حالة المصادقة عند تحميل الصفحة
resetAuthState();
