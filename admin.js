// ===== ПРОСТОЙ АДМИН КОНТРОЛЛЕР =====

// Конфигурация
const CONFIG = {
    SERVICES_KEY: 'art17_services',
    PRODUCTS_KEY: 'art17_products',
    APPLICATIONS_KEY: 'art17_applications'
};

// Объект для хранения данных
let appData = {
    services: [],
    products: []
};

// Загрузка данных
function loadData() {
    try {
        // Загружаем услуги
        const servicesJSON = localStorage.getItem(CONFIG.SERVICES_KEY);
        if (servicesJSON) {
            appData.services = JSON.parse(servicesJSON);
        }
        
        // Загружаем товары
        const productsJSON = localStorage.getItem(CONFIG.PRODUCTS_KEY);
        if (productsJSON) {
            appData.products = JSON.parse(productsJSON);
        }
        
        console.log('Данные загружены:', appData);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        appData = { services: [], products: [] };
    }
}

// Сохранение данных
function saveData() {
    try {
        localStorage.setItem(CONFIG.SERVICES_KEY, JSON.stringify(appData.services));
        localStorage.setItem(CONFIG.PRODUCTS_KEY, JSON.stringify(appData.products));
        console.log('Данные сохранены');
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        alert('Ошибка сохранения данных');
        return false;
    }
}

// ===== ОБРАБОТЧИКИ СОХРАНЕНИЯ =====

// Сохранение услуги
function saveService() {
    console.log('Сохраняем услугу...');
    
    const id = document.getElementById('serviceId').value;
    const serviceData = {
        name: document.getElementById('serviceName').value || 'Услуга без названия',
        description: document.getElementById('serviceDescription').value || 'Описание отсутствует',
        price: document.getElementById('servicePrice').value || 'Цена не указана',
        icon: document.getElementById('serviceIcon').value || 'fa-cogs',
        features: (document.getElementById('serviceFeatures').value || '').split('\n').filter(f => f.trim())
    };
    
    console.log('Данные услуги:', serviceData);
    
    if (id) {
        // Обновляем существующую
        const index = appData.services.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            appData.services[index] = { ...appData.services[index], ...serviceData };
        }
    } else {
        // Добавляем новую
        serviceData.id = Date.now();
        appData.services.push(serviceData);
    }
    
    saveData();
    closeModal('serviceModal');
    showNotification('Услуга сохранена!');
    renderServices();
    
    console.log('Услуги после сохранения:', appData.services);
}

// Сохранение товара
function saveProduct() {
    console.log('Сохраняем товар...');
    
    const id = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value || 'Товар без названия',
        description: document.getElementById('productDescription').value || 'Описание отсутствует',
        price: document.getElementById('productPrice').value || 'Цена не указана',
        category: document.getElementById('productCategory').value || 'Без категории',
        image: document.getElementById('productImage').value || '',
        location: document.getElementById('productLocation').value || 'В наличии',
        material: document.getElementById('productMaterial').value || '',
        age: document.getElementById('productAge').value || '',
        warranty: document.getElementById('productWarranty').value || '',
        size: document.getElementById('productSize').value || ''
    };
    
    console.log('Данные товара:', productData);
    
    if (id) {
        // Обновляем существующий
        const index = appData.products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            appData.products[index] = { ...appData.products[index], ...productData };
        }
    } else {
        // Добавляем новый
        productData.id = Date.now();
        appData.products.push(productData);
    }
    
    saveData();
    closeModal('productModal');
    showNotification('Товар сохранен!');
    renderProducts();
    
    console.log('Товары после сохранения:', appData.products);
}

// ===== УДАЛЕНИЕ =====

// Удаление услуги
function deleteService() {
    const id = document.getElementById('serviceId').value;
    if (id && confirm('Удалить эту услугу?')) {
        appData.services = appData.services.filter(s => s.id !== parseInt(id));
        saveData();
        closeModal('serviceModal');
        showNotification('Услуга удалена!', 'warning');
        renderServices();
    }
}

// Удаление товара
function deleteProduct() {
    const id = document.getElementById('productId').value;
    if (id && confirm('Удалить этот товар?')) {
        appData.products = appData.products.filter(p => p.id !== parseInt(id));
        saveData();
        closeModal('productModal');
        showNotification('Товар удален!', 'warning');
        renderProducts();
    }
}

// ===== РЕНДЕРИНГ =====

// Рендеринг услуг
function renderServices() {
    const container = document.getElementById('servicesList');
    if (!container) return;
    
    if (appData.services.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-concierge-bell fa-3x"></i>
                <h3>Услуг пока нет</h3>
                <p>Добавьте вашу первую услугу</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appData.services.map(service => `
        <div class="service-item" data-id="${service.id}">
            <div class="service-icon-small">
                <i class="fas ${service.icon || 'fa-paint-brush'}"></i>
            </div>
            <div class="item-content">
                <h4>${service.name}</h4>
                <p>${service.description}</p>
                <div class="item-meta">
                    <span class="price">${service.price}</span>
                    <span class="features">${service.features?.length || 0} особенностей</span>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-small" onclick="editService(${service.id})" title="Редактировать">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteServiceFromList(${service.id})" title="Удалить">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Рендеринг товаров
function renderProducts() {
    const container = document.getElementById('productsList');
    if (!container) return;
    
    if (appData.products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <h3>Товаров пока нет</h3>
                <p>Добавьте ваш первый товар</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appData.products.map(product => `
        <div class="product-item" data-id="${product.id}">
            <div class="product-image-small">
                <img src="${product.image || 'https://via.placeholder.com/200'}" 
                     alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/200'">
            </div>
            <div class="item-content">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <div class="item-meta">
                    <span class="price">${product.price}</span>
                    <span class="category">${product.category}</span>
                    <span class="location">${product.location}</span>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn btn-small" onclick="editProduct(${product.id})" title="Редактировать">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteProductFromList(${product.id})" title="Удалить">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== РЕДАКТИРОВАНИЕ =====

// Редактировать услугу
function editService(id) {
    const service = appData.services.find(s => s.id === id);
    if (!service) return;
    
    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceName').value = service.name || '';
    document.getElementById('serviceDescription').value = service.description || '';
    document.getElementById('servicePrice').value = service.price || '';
    document.getElementById('serviceIcon').value = service.icon || '';
    document.getElementById('serviceFeatures').value = (service.features || []).join('\n') || '';
    
    document.getElementById('deleteServiceBtn').style.display = 'block';
    openModal('serviceModal');
}

// Редактировать товар
function editProduct(id) {
    const product = appData.products.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productPrice').value = product.price || '';
    document.getElementById('productCategory').value = product.category || '';
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productLocation').value = product.location || 'В наличии';
    document.getElementById('productMaterial').value = product.material || '';
    document.getElementById('productAge').value = product.age || '';
    document.getElementById('productWarranty').value = product.warranty || '';
    document.getElementById('productSize').value = product.size || '';
    
    // Превью картинки
    const preview = document.getElementById('productImagePreview');
    if (preview && product.image) {
        preview.innerHTML = `<img src="${product.image}" alt="Превью" style="max-width: 100%; border-radius: 5px;">`;
    }
    
    document.getElementById('deleteProductBtn').style.display = 'block';
    openModal('productModal');
}

// ===== УДАЛЕНИЕ ИЗ СПИСКА =====

function deleteServiceFromList(id) {
    if (confirm('Удалить эту услугу?')) {
        appData.services = appData.services.filter(s => s.id !== id);
        saveData();
        showNotification('Услуга удалена!', 'warning');
        renderServices();
    }
}

function deleteProductFromList(id) {
    if (confirm('Удалить этот товар?')) {
        appData.products = appData.products.filter(p => p.id !== id);
        saveData();
        showNotification('Товар удален!', 'warning');
        renderProducts();
    }
}

// ===== УТИЛИТЫ =====

// Открыть модальное окно
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Закрыть модальное окно
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Сбрасываем форму
        if (modalId === 'serviceModal' || modalId === 'productModal') {
            modal.querySelector('form').reset();
            document.getElementById('productImagePreview').innerHTML = '';
        }
    }
}

// Показать уведомление
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    if (!container) {
        // Создаем контейнер, если его нет
        const newContainer = document.createElement('div');
        newContainer.id = 'notificationContainer';
        newContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
        `;
        document.body.appendChild(newContainer);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 5px;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.getElementById('notificationContainer').appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Переключение секций
function switchSection(sectionId) {
    // Убираем активный класс у всех ссылок
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(sectionId)) {
            link.classList.add('active');
        }
    });
    
    // Скрываем все секции
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Показываем нужную секцию
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Обновляем заголовок
        const titles = {
            dashboard: 'Дашборд',
            services: 'Управление услугами',
            products: 'Управление товарами',
            portfolio: 'Управление портфолио',
            images: 'Менеджер картинок',
            applications: 'Заявки с сайта',
            settings: 'Настройки сайта'
        };
        
        const titleElement = document.getElementById('pageTitle');
        if (titleElement) {
            titleElement.textContent = titles[sectionId] || sectionId;
        }
    }
}

// Добавить новую услугу
function addService() {
    // Сбрасываем форму
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = '';
    document.getElementById('deleteServiceBtn').style.display = 'none';
    openModal('serviceModal');
}

// Добавить новый товар
function addProduct() {
    // Сбрасываем форму
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productLocation').value = 'В наличии';
    document.getElementById('productImagePreview').innerHTML = '';
    document.getElementById('deleteProductBtn').style.display = 'none';
    openModal('productModal');
}

// Обновить превью картинки
function updateImagePreview() {
    const url = document.getElementById('productImage').value;
    const preview = document.getElementById('productImagePreview');
    if (preview && url) {
        preview.innerHTML = `<img src="${url}" alt="Превью" style="max-width: 100%; border-radius: 5px;" onerror="this.src='https://via.placeholder.com/200'">`;
    }
}

// Сохранить все данные
function saveAll() {
    if (saveData()) {
        showNotification('Все данные сохранены!');
    }
}

// Экспорт данных
function exportData() {
    const data = {
        services: appData.services,
        products: appData.products,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `art17-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Данные экспортированы!');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Админ панель загружается...');
    
    // Загружаем данные
    loadData();
    
    // Рендерим данные
    renderServices();
    renderProducts();
    
    // Инициализируем превью картинки
    document.getElementById('productImage')?.addEventListener('input', updateImagePreview);
    
    // Обработчик закрытия модальных окон
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Закрытие модального окна по клику на фон
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Обработчик кнопки меню (для мобильной версии)
    document.getElementById('menuToggle')?.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });
    
    console.log('Админ панель готова к работе!');
    console.log('Услуг:', appData.services.length);
    console.log('Товаров:', appData.products.length);
    
    // Показываем приветственное сообщение
    setTimeout(() => {
        showNotification('Админ панель загружена и готова к работе!');
    }, 1000);
});
