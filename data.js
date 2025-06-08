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
        allEmployees = Array.isArray(data) ? data : Object.values(data);
        
        if (allEmployees.length === 0) {
            throw new Error('ملف البيانات فارغ أو غير صالح');
        }
        
        console.log('تم تحميل بيانات', allEmployees.length, 'موظف');
        return { success: true, count: allEmployees.length };
    } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
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

    const cleanId = nationalId.replace(/\D/g, '');
    return allEmployees.find(emp => 
        emp['الرقم الوطني'] && emp['الرقم الوطني'].toString().includes(cleanId)
    );
}

window.data = {
    loadEmployeeData,
    searchEmployee,
    getEmployees: () => allEmployees,
    isUsingSampleData: () => allEmployees === getSampleData()
};
