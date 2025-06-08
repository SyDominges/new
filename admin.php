<?php
// اسم ملف JSON
$jsonFile = __DIR__ . '/8jfh0-7m5vq.json';

// قراءة الملف وتحويله إلى مصفوفة PHP
$employees = [];
if (file_exists($jsonFile)) {
    $jsonContent = file_get_contents($jsonFile);
    $employees = json_decode($jsonContent, true);
    if ($employees === null) {
        $error = "تعذر قراءة بيانات الموظفين من ملف JSON.";
    }
} else {
    $error = "ملف البيانات غير موجود.";
}

// البحث
$searchTerm = '';
$results = [];
if (isset($_GET['search'])) {
    $searchTerm = trim($_GET['search']);

    if ($searchTerm !== '') {
        $searchTermLower = mb_strtolower($searchTerm);

        // فلترة النتائج بالبحث في كل قيمة من كل سجل
        foreach ($employees as $emp) {
            foreach ($emp as $key => $value) {
                // تجاهل الحقول غير النصية أو غير القابلة للبحث (يمكن تعديلها حسب الحاجة)
                if (is_string($value) || is_numeric($value)) {
                    // تحويل للقيمة نص صغير ومقارنة
                    $valueLower = mb_strtolower((string)$value);
                    if (strpos($valueLower, $searchTermLower) !== false) {
                        $results[] = $emp;
                        break; // وجد تطابق في هذا السجل - لا داعي للاستمرار
                    }
                }
            }
            if (count($results) >= 10) break; // عرض فقط أول 10 نتائج
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>نظام استعلام الموظفين</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            max-width: 900px;
            margin: 40px auto;
            padding: 20px;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
        }
        form {
            margin-bottom: 25px;
            text-align: center;
        }
        input[type="text"] {
            width: 300px;
            padding: 10px;
            font-size: 16px;
            border-radius: 6px;
            border: 1px solid #ddd;
            transition: border-color 0.3s;
        }
        input[type="text"]:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 5px rgba(52,152,219,0.5);
        }
        button {
            padding: 10px 18px;
            font-size: 16px;
            border: none;
            background-color: #2c3e50;
            color: white;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-left: 8px;
        }
        button:hover {
            background-color: #1a252f;
        }
        .error {
            color: #e74c3c;
            margin-bottom: 20px;
            text-align: center;
        }
        .results {
            margin-top: 20px;
        }
        .employee-card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
            padding: 15px 20px;
            margin-bottom: 15px;
            line-height: 1.5;
            direction: rtl;
        }
        .employee-card h2 {
            margin-bottom: 8px;
            color: #2c3e50;
            font-size: 20px;
        }
        .employee-info {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        .info-label {
            font-weight: bold;
            width: 140px;
            color: #555;
        }
        .info-value {
            flex: 1;
            word-break: break-word;
        }
        @media print {
            body * { visibility: hidden; }
            .employee-card, .employee-card * {
                visibility: visible;
            }
            .employee-card {
                position: absolute;
                top: 0; right: 0; left: 0;
                margin: auto;
                box-shadow: none;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <h1>نظام استعلام الموظفين</h1>

    <form method="get" action="">
        <input type="text" name="search" placeholder="أدخل كلمة أو رقم للبحث..." value="<?php echo htmlspecialchars($searchTerm); ?>" />
        <button type="submit">استعلام</button>
    </form>

    <?php if (!empty($error)): ?>
        <div class="error"><?php echo htmlspecialchars($error); ?></div>
    <?php endif; ?>

    <?php if ($searchTerm !== ''): ?>
        <div class="results">
            <h2>نتائج البحث (<?php echo count($results); ?> سجل/سجلات)</h2>

            <?php if (count($results) === 0): ?>
                <p>لا توجد سجلات تطابق البحث.</p>
            <?php else: ?>
                <?php foreach ($results as $emp): ?>
                    <div class="employee-card">
                        <h2>
                            <?php
                            // عرض الاسم الثلاثي: الاسم والنسبة، اسم الأب، اسم الأم
                            $fullName = $emp['الاسم والنسبة'] ?? '';
                            $father = trim($emp['اسم الأب'] ?? '');
                            $mother = trim($emp['اسم الأم'] ?? '');
                            echo htmlspecialchars($fullName);
                            if ($father) echo " - " . htmlspecialchars($father);
                            if ($mother) echo " - " . htmlspecialchars($mother);
                            ?>
                        </h2>
                        <div class="employee-info">
                            <div class="info-label">الرقم الوطني:</div>
                            <div class="info-value"><?php echo htmlspecialchars($emp['الرقم الوطني'] ?? '-'); ?></div>

                            <div class="info-label">الرقم الذاتي:</div>
                            <div class="info-value"><?php echo htmlspecialchars($emp['الرقم الذاتي'] ?? '-'); ?></div>

                            <div class="info-label">الجهة:</div>
                            <div class="info-value"><?php echo htmlspecialchars($emp['الجهة'] ?? '-'); ?></div>

                            <div class="info-label">الشهادة:</div>
                            <div class="info-value"><?php echo htmlspecialchars($emp['الشهادة'] ?? '-'); ?></div>

                            <div class="info-label">التخصص:</div>
                            <div class="info-value"><?php echo htmlspecialchars($emp['التخصص'] ?? '-'); ?></div>

                            <div class="info-label">مسمى وظيفي:</div>
                            <div class="info-value"><?php echo htmlspecialchars($emp['مسمى وظيفي'] ?? '-'); ?></div>

                            <div class="info-label">الولادة:</div>
                            <div class="info-value">
                                <?php
                                $day = $emp['المواليد / اليوم'] ?? '';
                                $month = $emp['المواليد / شهر'] ?? '';
                                $year = $emp['المواليد / عام'] ?? '';
                                if ($day && $month && $year) {
                                    echo htmlspecialchars("$day/$month/$year");
                                } else {
                                    echo '-';
                                }
                                ?>
                            </div>

                            <div class="info-label">القيد والخانة:</div>
                            <div class="info-value"><?php echo htmlspecialchars($emp['القيد والخانة'] ?? '-'); ?></div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</body>
</html>
