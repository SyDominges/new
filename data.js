const DATA_CONFIG = {
    DATA_FILE: "8jfh0-7m5vq.json"
};

let allEmployees = [];
let usingSampleData = false; // متغير لتتبع استخدام البيانات التجريبية

async function loadEmployeeData() {
    try {
        console.log('جاري تحميل بيانات الموظفين...');
        const response = await fetch(DATA_CONFIG.DATA_FILE);
        
        if (!response.ok) {
            throw new Error(`فشل تحميل ملف البيانات: ${response.status}`);
        }
        
        const data = await response.json();
        
        // تحويل البيانات إلى مصفوفة إذا كانت كائنًا
        allEmployees = Array.isArray(data) ? data : Object.values(data);
        
        if (allEmployees.length === 0) {
            throw new Error('ملف البيانات فارغ أو غير صالح');
        }
        
        usingSampleData = false;
        console.log('تم تحميل بيانات', allEmployees.length, 'موظف بنجاح');
        return { success: true, count: allEmployees.length };
    } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
        allEmployees = getSampleData();
        usingSampleData = true;
        return { 
            success: false, 
            error: error.message,
            usedSampleData: true
        };
    }
}

function getSampleData() {
    return [
        {
            "الاسم والنسبة": "بيانات تجريبية",
            "الرقم الذاتي": "1234567890",
            "اسم الأم": "فاطمة محمد",
            "الولادة والتاريخ": "01/01/1990",
            "اليوم": "01",
            "الشهر": "01",
            "العام": "1990",
            "الشهادة": "بكالوريوس",
            "التخصص": "علوم حاسوب",
            "المسمى الوظيفي": "مبرمج",
            "الجهة": "وزارة التربية",
            "الدرجة": "عاشر",
            "تاريخ التعيين": "01/01/2020",
            "الحالة الوظيفية": "على رأس العمل"
        }
    ];
}

function searchEmployee(nationalId) {
    if (!nationalId || nationalId.replace(/\D/g, '').length < 8) {
        return null;
    }

    const cleanId = nationalId.replace(/\D/g, '');
    const foundEmployee = allEmployees.find(emp => 
        emp['الرقم الذاتي'] && emp['الرقم الذاتي'].toString().includes(cleanId)
    );
    
    return foundEmployee || null;
}

window.data = {
    loadEmployeeData,
    searchEmployee,
    getEmployees: () => allEmployees,
    isUsingSampleData: () => usingSampleData
};
