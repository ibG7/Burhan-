// محاكاة قاعدة بيانات محلية
let products = JSON.parse(localStorage.getItem('products')) || [];
let invoices = JSON.parse(localStorage.getItem('invoices')) || [];

// محاكاة خادم مركزي
let server = {
    products: [],
    invoices: []
};

// دالة لتسجيل الدخول وتحديد نوع المستخدم
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "admin" && password === "admin") {
        // المدير
        localStorage.setItem('userType', 'admin');
    } else if (username === "client" && password === "client") {
        // العميل
        localStorage.setItem('userType', 'client');
    } else {
        alert("اسم المستخدم أو كلمة المرور غير صحيحة");
        return;
    }

    document.getElementById('login-form').style.display = 'none';
    document.getElementById('content').style.display = 'block';

    checkUserPermissions();
    renderProducts();
    renderInvoices();
}

// دالة للتحقق من نوع المستخدم (مدير أو عميل)
function checkUserPermissions() {
    const userType = localStorage.getItem('userType');

    if (userType === 'admin') {
        // إظهار الأزرار الخاصة بالمدير
        document.getElementById('manager-actions').style.display = 'block';
    } else if (userType === 'client') {
        // إخفاء الأزرار الخاصة بالمدير عن العميل
        document.getElementById('manager-actions').style.display = 'none';
    }
}

// دالة لإضافة صنف جديد (للمدير فقط)
function addProduct() {
    const productName = prompt("أدخل اسم الصنف:");
    const productType = prompt("أدخل نوع الصنف:");
    const productCode = prompt("أدخل رقم الصنف:");
    const productPrice = prompt("أدخل سعر الصنف:");
    const productionDate = prompt("أدخل تاريخ الإنتاج (YYYY-MM-DD):");
    const expirationDate = prompt("أدخل تاريخ الانتهاء (YYYY-MM-DD):");

    const product = {
        name: productName,
        type: productType,
        code: productCode,
        price: productPrice,
        productionDate: productionDate,
        expirationDate: expirationDate
    };

    products.push(product);
    localStorage.setItem('products', JSON.stringify(products)); // حفظ البيانات في localStorage
    renderProducts();  // إعادة عرض الأصناف
}

// دالة لإضافة فاتورة جديدة (للمدير فقط)
function addInvoice() {
    const clientName = prompt("أدخل اسم العميل:");
    const productName = prompt("أدخل اسم الصنف:");
    const price = prompt("أدخل السعر:");
    const quantity = prompt("أدخل العدد:");

    const total = price * quantity;

    const invoice = {
        clientName: clientName,
        productName: productName,
        price: price,
        quantity: quantity,
        total: total
    };

    invoices.push(invoice);
    localStorage.setItem('invoices', JSON.stringify(invoices)); // حفظ البيانات في localStorage
    renderInvoices();  // إعادة عرض الفواتير
}

// دالة لعرض الأصناف
function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // مسح القائمة السابقة

    products.forEach((product, index) => {
        productList.innerHTML += `
            <div>
                <input type="checkbox" id="product-${index}">
                <span>${product.name} - ${product.type} - ${product.price}</span>
            </div>
        `;
    });
}

// دالة لعرض الفواتير
function renderInvoices() {
    const invoiceList = document.getElementById('invoice-list');
    invoiceList.innerHTML = ''; // مسح القائمة السابقة

    invoices.forEach((invoice, index) => {
        invoiceList.innerHTML += `
            <div>
                <input type="checkbox" id="invoice-${index}">
                <span>اسم العميل: ${invoice.clientName} - الصنف: ${invoice.productName} - المجموع: ${invoice.total}</span>
            </div>
        `;
    });
}

// دالة لحذف العناصر المحددة (للمدير فقط)
function deleteSelected() {
    // حذف الأصناف المحددة
    products = products.filter((_, index) => !document.getElementById(`product-${index}`).checked);
    // حذف الفواتير المحددة
    invoices = invoices.filter((_, index) => !document.getElementById(`invoice-${index}`).checked);

    localStorage.setItem('products', JSON.stringify(products)); // حفظ البيانات بعد الحذف
    localStorage.setItem('invoices', JSON.stringify(invoices)); // حفظ البيانات بعد الحذف
    renderProducts();  // إعادة عرض الأصناف
    renderInvoices();  // إعادة عرض الفواتير
}

// دالة لطباعة العناصر المحددة
function printSelected() {
    const selectedProducts = [];
    const selectedInvoices = [];

    products.forEach((product, index) => {
        if (document.getElementById(`product-${index}`).checked) {
            selectedProducts.push(product);
        }
    });

    invoices.forEach((invoice, index) => {
        if (document.getElementById(`invoice-${index}`).checked) {
            selectedInvoices.push(invoice);
        }
    });

    let printContent = '<h2>الأصناف المحددة:</h2><ul>';
    selectedProducts.forEach(product => {
        printContent += `<li>${product.name} - ${product.type} - ${product.price}</li>`;
    });

    printContent += '</ul><h2>الفواتير المحددة:</h2><ul>';
    selectedInvoices.forEach(invoice => {
        printContent += `<li>اسم العميل: ${invoice.clientName} - الصنف: ${invoice.productName} - المجموع: ${invoice.total}</li>`;
    });

    printContent += '</ul>';

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// ربط زر تسجيل الدخول بالوظيفة
document.getElementById('login-btn').addEventListener('click', login);