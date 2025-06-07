document.addEventListener('DOMContentLoaded', () => {
    // تعريف العناصر
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const errorMessage = document.getElementById('errorMessage');
    const noResults = document.getElementById('noResults');
    const employeeDetails = document.getElementById('employeeDetails');
    const loading = document.getElementById('loading');
    const detailsContent = document.getElementById('detailsContent');
    const employeeName = document.getElementById('employeeName');

    // بيانات الموظفين (سيتم ملؤها عند تسجيل الدخول)
    let employeesData = [];

    // حدث النقر على زر الاستعلام
    searchButton.addEventListener('click', async () => {
        try {
            // إخفاء الرسائل السابقة
            errorMessage.style.display = 'none';
            noResults.style.display = 'none';
            employeeDetails.style.display = 'none';
            
            // إظهار حالة التحميل
            loading.style.display = 'flex';
            
            // الحصول على قيمة البحث
            const searchTerm = searchInput.value.trim();
            const cleanId = searchTerm.replace(/\D/g, '');
            
            // التحقق من صحة الإدخال
            if (cleanId.length < 8) {
                throw new Error('الرجاء إدخال 8 أرقام على الأقل');
            }
            
            // محاكاة تأخير الشبكة
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // البحث في البيانات
            const employee = employeesData.find(emp => 
                emp['الرقم الوطني'] && emp['الرقم الوطني'].toString().includes(cleanId)
            );
            
            if (employee) {
                // عرض النتائج
                employeeName.textContent = employee['الاسم والنسبة'] || 'بيانات الموظف';
                detailsContent.innerHTML = '';
                
                // إضافة الحقول المتاحة
                ['الرقم الوطني', 'التخصص', 'الجهة'].forEach(field => {
                    if (employee[field]) {
                        const row = document.createElement('div');
                        row.className = 'detail-row';
                        row.innerHTML = `
                            <div class="detail-label">${field}:</div>
                            <div class="detail-value">${employee[field]}</div>
                        `;
                        detailsContent.appendChild(row);
                    }
                });
                
                employeeDetails.style.display = 'block';
            } else {
                throw new Error('لا توجد بيانات مطابقة للرقم الوطني المدخل');
            }
        } catch (error) {
            // عرض رسالة الخطأ المناسبة
            if (error.message.includes('8 أرقام')) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            } else {
                noResults.textContent = error.message;
                noResults.style.display = 'block';
            }
            
            console.error('خطأ في البحث:', error);
        } finally {
            // إخفاء حالة التحميل
            loading.style.display = 'none';
        }
    });

    // حدث الإدخال للتحقق من الصحة أثناء الكتابة
    searchInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length >= 8) {
            errorMessage.style.display = 'none';
        }
    });

    // البحث عند الضغط على Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
});
