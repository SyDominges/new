const DATA_CONFIG = {
    BASE_URL: "https://joyful-caramel-f0cac9.netlify.app/",
    FILES: ["encrypted_part11.json", "encrypted_part22.json"],
    ENCRYPTION_KEY: "@ali96json@"
};

let allEmployees = [];

async function loadEmployeeData() {
    try {
        const responses = await Promise.all(
            DATA_CONFIG.FILES.map(file => 
                fetch(`${DATA_CONFIG.BASE_URL}${file}`)
                .then(res => res.text())
            )
        );

        const decryptedData = responses.map(data => {
            try {
                const bytes = CryptoJS.AES.decrypt(data, DATA_CONFIG.ENCRYPTION_KEY);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                return JSON.parse(decrypted);
            } catch (e) {
                console.error("فك التشفير فشل:", e);
                return {};
            }
        });

        allEmployees = decryptedData.flatMap(Object.values);
        return { success: true, count: allEmployees.length };
    } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
        allEmployees = getSampleData();
        return { success: false, error: error.message };
    }
}

function getSampleData() {
    return [{
        "الاسم والنسبة": "بيانات تجريبية",
        "الرقم الوطني": "1234567890",
        "التخصص": "اختبار النظام",
        "الجهة": "نظام الاستعلام"
    }];
}

function searchEmployee(nationalId) {
    const cleanId = nationalId.replace(/\D/g, '');
    return allEmployees.find(emp => 
        emp['الرقم الوطني'] && emp['الرقم الوطني'].toString().includes(cleanId)
    ) || getSampleData()[0];
}

window.data = {
    loadEmployeeData,
    searchEmployee,
    getEmployees: () => allEmployees
};
