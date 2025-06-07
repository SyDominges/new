<?php
$password = "@ali96json@";
$file_url = "https://joyful-caramel-f0cac9.netlify.app/encrypted_part11.json";

// تحويل كلمة المرور إلى مفتاح
function passwordToKey($password) {
    return substr(
        str_replace(['+', '/'], ['-', '_'], 
        base64_encode(hash('sha256', $password, true))
    , 0, 32);
}

// فك التشفير
function decrypt($encrypted, $password) {
    $key = passwordToKey($password);
    $decrypted = openssl_decrypt(
        $encrypted, 
        'aes-256-cbc', 
        base64_decode($key),
        OPENSSL_RAW_DATA,
        str_repeat("\0", 16)
    );
    return json_decode($decrypted, true);
}

// التنفيذ
try {
    echo "📥 جاري تحميل الملف...\n";
    $encrypted = file_get_contents($file_url);
    
    echo "🔓 جاري فك التشفير...\n";
    $data = decrypt($encrypted, $password);
    
    echo "✅ البيانات المفكوكة: " . print_r($data['user']['name'], true); // غير المسار
} catch (Exception $e) {
    echo "❌ خطأ: " . $e->getMessage();
}
?>
