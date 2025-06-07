// تكوين البيانات
const DATA_CONFIG = {
    BASE_URL: "https://joyful-caramel-f0cac9.netlify.app/",
    FILES: ["encrypted_part11.json", "encrypted_part22.json"],
    ENCRYPTION_KEY: "@ali96json@",
    CACHE_TIME: 3600000 // 1 ساعة
};

let allEmployees = [];
let lastLoadTime = 0;

// تحميل بيانات الموظفين
async function loadEmployeeData() {
    try {
        // التحقق من وجود بيانات حديثة في الذاكرة المؤقتة
        const currentTime = Date.now();
        if (allEmployees.length > 0 && (currentTime - lastLoadTime) < DATA_CONFIG.CACHE_TIME) {
            return { success: true, fromCache: true, count: allEmployees.length };
        }

        // تحميل البيانات من الملفات المشفرة
        const responses = await Promise.all(
            DATA_CONFIG.FILES.map(file => 
                fetch(`${DATA_CONFIG.BASE_URL}${file}`)
                .then(res => {
                    if (!res.ok) throw new Error(`فشل تحميل الملف: ${file}`);
                    return res.text();
                })
                .catch(err => {
                    console.error(`خطأ في تحميل ${file}:`, err);
                    return null;
                })
            )
        );

        // فك تشفير البيانات
        const decryptedData = [];
        for (const data of responses) {
            if (!data) continue;
            
            try {
                const bytes = CryptoJS.AES.decrypt(data.trim(), DATA_CONFIG.ENCRYPTION_KEY);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                
                if (!decrypted) {
                    throw new Error('فك التشفير لم يعطي أي نتيجة');
                }
                
                const parsed = JSON.parse(decrypted);
                decryptedData.push(parsed);
            } catch (e) {
                console.error("فك التشفير فشل:", e);
                continue;
            }
        }

        // دمج البيانات
        allEmployees = decryptedData.flatMap(data => {
            if (data && typeof data === 'object') {
                return Object.values(data);
            }
            return [];
        });

        lastLoadTime = currentTime;
        
        if (allEmployees.length === 0) {
            throw new Error('لا توجد بيانات صالحة بعد فك التشفير');
        }
        
        return { success: true, fromCache: false, count: allEmployees.length };
    } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
        allEmployees = getSampleData();
        return { success: false, error: error.message };
    }
}

// بيانات تجريبية
function getSampleData() {
    return [{
        "الاسم والنسبة": "بيانات تجريبية",
        "الرقم الوطني": "1234567890",
        "التخصص": "اختبار النظام",
        "الجهة": "نظام الاستعلام",
        "الدرجة": "عاشر",
        "تاريخ التعيين": "01/01/2023",
        "الحالة الوظيفية": "على رأس العمل"
    }];
}

// البحث عن موظف بالرقم الوطني
function searchEmployee(nationalId) {
    if (!nationalId || nationalId.replace(/\D/g, '').length < 8) {
        return null;
    }

    const cleanId = nationalId.replace(/\D/g, '');
    
    // البحث في البيانات الفعلية
    const foundEmployee = allEmployees.find(emp => 
        emp['الرقم الوطني'] && emp['الرقم الوطني'].toString().includes(cleanId)
    );
    
    return foundEmployee || null;
}

// تصدير الدوال
window.data = {
    loadEmployeeData,
    searchEmployee,
    getEmployeeCount: () => allEmployees.length,
    getSampleData
};
