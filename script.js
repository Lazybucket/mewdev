
// Biến toàn cục
let cart = [];
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1397623620049572012/UB7R06-vCsbpvcN2p-zztvftzOwh2wHMsyWtQxojDMtq5bfiJ3hfc0VtXrW-tK0WYROF';

// Hàm chuyển đổi tab
function showTab(tabName) {
    // Ẩn tất cả tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Bỏ active từ tất cả tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Hiển thị tab được chọn
    document.getElementById(tabName).classList.add('active');
    
    // Thêm active cho button được chọn
    event.target.classList.add('active');
    
    // Nếu không có event.target, tìm button theo tab name
    if (!event.target.classList.contains('tab-btn')) {
        const targetBtn = Array.from(tabButtons).find(btn => 
            btn.onclick.toString().includes(tabName)
        );
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    }
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart() {
    const product = {
        id: 1,
        name: 'Tài liệu học tập vào 10',
        price: 30000,
        quantity: 1
    };
    
    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    updateCartDisplay();
    updateCartCount();
    
    // Hiển thị thông báo
    showNotification('Đã thêm sản phẩm vào giỏ hàng!');
    
    // Chuyển sang tab giỏ hàng
    setTimeout(() => {
        showTabProgrammatically('cart');
    }, 1000);
}

// Hàm hiển thị tab bằng code
function showTabProgrammatically(tabName) {
    // Ẩn tất cả tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Bỏ active từ tất cả tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Hiển thị tab được chọn
    document.getElementById(tabName).classList.add('active');
    
    // Tìm và active button tương ứng
    const targetBtn = Array.from(tabButtons).find(btn => 
        btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${tabName}'`)
    );
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
}

// Hàm cập nhật hiển thị giỏ hàng
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Giỏ hàng của bạn đang trống</p>
            </div>
        `;
        cartTotal.style.display = 'none';
    } else {
        let cartHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartHTML += `
                <div class="cart-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p>Giá: ${formatPrice(item.price)}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <button onclick="decreaseQuantity(${index})" style="background: #ff4757; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">-</button>
                            <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.quantity}</span>
                            <button onclick="increaseQuantity(${index})" style="background: #2ed573; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">+</button>
                        </div>
                        <button onclick="removeFromCart(${index})" style="background: #ff4757; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        cartTotal.style.display = 'block';
        document.getElementById('totalAmount').textContent = formatPrice(total);
    }
}

// Hàm tăng số lượng
function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCartDisplay();
    updateCartCount();
}

// Hàm giảm số lượng
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateCartDisplay();
    updateCartCount();
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateCartCount();
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng!');
}

// Hàm cập nhật số lượng trong icon giỏ hàng
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Hàm format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Hàm hiển thị form thanh toán
function showCheckout() {
    if (cart.length === 0) {
        showNotification('Giỏ hàng của bạn đang trống!');
        return;
    }
    
    // Cập nhật thông tin đơn hàng trong form
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNames = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    
    document.getElementById('orderName').value = orderNames;
    document.getElementById('price').value = formatPrice(total);
    
    // Hiển thị modal
    document.getElementById('checkoutModal').style.display = 'block';
}

// Hàm đóng form thanh toán
function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
    document.getElementById('checkoutForm').reset();
}

// Hàm xử lý form thanh toán
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkoutForm');
    
    checkoutForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Lấy dữ liệu từ form
        const formData = new FormData(checkoutForm);
        const orderData = {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            orderName: formData.get('orderName'),
            price: formData.get('price'),
            email: formData.get('email') || 'Không cung cấp',
            note: formData.get('note') || 'Không có ghi chú'
        };
        
        // Tạo message cho Discord
        const discordMessage = {
            embeds: [{
                title: '🛒 Đơn Hàng Mới',
                color: 0x667eea,
                fields: [
                    {
                        name: '👤 Họ và Tên',
                        value: orderData.fullName,
                        inline: true
                    },
                    {
                        name: '📱 Số Điện Thoại',
                        value: orderData.phone,
                        inline: true
                    },
                    {
                        name: '📧 Email',
                        value: orderData.email,
                        inline: true
                    },
                    {
                        name: '📦 Tên Đơn Hàng',
                        value: orderData.orderName,
                        inline: false
                    },
                    {
                        name: '💰 Giá',
                        value: orderData.price,
                        inline: true
                    },
                    {
                        name: '📝 Ghi Chú',
                        value: orderData.note,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Cửa Hàng Tài Liệu Học Tập'
                }
            }]
        };
        
        try {
            // Gửi đến Discord webhook
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(discordMessage)
            });
            
            if (response.ok) {
                showNotification('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.', 'success');
                
                // Reset giỏ hàng và form
                cart = [];
                updateCartDisplay();
                updateCartCount();
                closeCheckout();
                
                // Chuyển về trang chủ
                setTimeout(() => {
                    showTabProgrammatically('home');
                }, 2000);
            } else {
                throw new Error('Lỗi khi gửi đơn hàng');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!', 'error');
        }
    });
});

// Hàm hiển thị thông báo
function showNotification(message, type = 'info') {
    // Tạo element thông báo
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;
    
    // Màu sắc theo loại thông báo
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #2ed573, #17c0eb)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ff4757, #ff3742)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    // Thêm CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Thêm vào trang
    document.body.appendChild(notification);
    
    // Tự động xóa sau 4 giây
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modal = document.getElementById('checkoutModal');
    if (event.target === modal) {
        closeCheckout();
    }
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị tab home mặc định
    showTabProgrammatically('home');
    updateCartCount();
});

