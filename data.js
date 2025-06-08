const DATA_CONFIG = {
    DATA_FILE: "8jfh0-7m5vq.json" // اسم الملف في نفس المجلد
};

let allEmployees = [];

async function loadEmployeeData() {
    try {
        // تحميل الملف من نفس المجلد
        const response = await fetch(DATA_CONFIG.DATA_FILE);
        
        if (!response.ok) {
            throw new Error(`فشل تحميل ملف البيانات: ${DATA_CONFIG.DATA_FILE}`);
        }

        const data = await response.json();
        
        // تحويل البيانات إلى مصفوفة
        let rawEmployees = Array.isArray(data) ? data : Object.values(data);
        
        if (rawEmployees.length === 0) {
            throw new Error('ملف البيانات فارغ أو غير صالح');
        }

        // تنظيف الحقول من المسافات وعلامات التنصيص المفردة
        allEmployees = rawEmployees.map(emp => {
            const cleanEmp = {};
            for (let key in emp) {
                let value = emp[key];
                if (typeof value === 'string') {
                    value = value.trim().replace(/^'+|'+$/g, ''); // يزيل علامات تنصيص مفردة
                }
                cleanEmp[key.trim()] = value;
            }
            return cleanEmp;
        });

        console.log('✅ تم تحميل بيانات', allEmployees.length, 'موظف');
        return { success: true, count: allEmployees.length };

    } catch (error) {
        console.error("❌ خطأ في تحميل البيانات:", error);
        allEmployees = getSampleData();
        return {
            success: false,
            error: error.message,
            usedSampleData: true
        };
    }
}

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

function searchEmployee(nationalId) {
    if (!nationalId || nationalId.replace(/\D/g, '').length < 8) {
        return null;
    }

    const cleanId = nationalId.replace(/\D/g, '').trim();
    console.log("🔍 البحث عن الرقم:", cleanId);

    const match = allEmployees.find(emp => {
        const empId = emp['الرقم الوطني']?.toString().trim();
        return empId === cleanId;
    });

    console.log("🔎 النتيجة:", match);
    return match;
}

window.data = {
    loadEmployeeData,
    searchEmployee,
    getEmployees: () => allEmployees,
    isUsingSampleData: () => allEmployees.length === 1 && allEmployees[0]['الاسم والنسبة'] === "بيانات تجريبية"
};
