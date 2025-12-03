// הכתובת של הסקריפט שלך בגוגל
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwVELIuSRNzQcXSelQXscprLBAPKOUyx2AlfU2DSmWxnPagy_KZXItgnnJIm3BViy-v/exec";

function uploadFile(type) {
    // זיהוי האלמנטים הנכונים לפי סוג ההעלאה (קורות חיים או תמונה)
    const inputId = type === 'cv' ? 'cvInput' : 'imageInput';
    const statusId = type === 'cv' ? 'cvStatus' : 'imageStatus';
    
    const fileInput = document.getElementById(inputId);
    const statusDiv = document.getElementById(statusId);
    
    // בדיקה אם נבחר קובץ
    if (fileInput.files.length === 0) {
        statusDiv.innerText = "⚠️ אנא בחר קובץ לפני השליחה";
        statusDiv.style.color = "red";
        return;
    }

    const file = fileInput.files[0];
    
    // חיווי למשתמש שההעלאה מתחילה
    statusDiv.innerText = "⏳ מעלה קובץ, אנא המתן...";
    statusDiv.style.color = "blue";

    // קריאת הקובץ והמרתו לפורמט שניתן לשלוח
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = function(e) {
        // ניקוי החלק המקדים של המחרוזת (data:image/png;base64,...)
        const rawBase64 = reader.result.split(',')[1];

        const dataPayload = {
            type: type,
            filename: file.name,
            mimeType: file.type,
            file: rawBase64
        };

        // שליחת הנתונים לסקריפט של גוגל
        fetch(WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify(dataPayload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === "success") {
                statusDiv.innerText = "✅ הקובץ הועלה בהצלחה!";
                statusDiv.style.color = "green";
                fileInput.value = ""; // איפוס השדה
            } else {
                throw new Error(data.error || "שגיאה לא ידועה");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            statusDiv.innerText = "❌ שגיאה בהעלאה. נסה שוב.";
            statusDiv.style.color = "red";
        });
    };
}
