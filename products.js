const productList = document.getElementById('product-list');
let selectedProducts = [];

// Load data from JSON file
fetch('data.json')
    .then(response => {
        if (!response.ok) throw new Error("Cannot load data.json");
        return response.json();
    })
    .then(data => {
        // Render products
        data.product.forEach(product => {
            const col = document.createElement('div');
            col.className = 'col-md-4 d-flex align-items-stretch';
            col.innerHTML = `
                <div class="card shadow-sm border-0 w-100 mb-4">
                    <img src="images/${product.image_url}" class="card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">
                            <span class="badge bg-danger me-1">${product.version}</span>
                            <span class="badge bg-primary">${product.user_level}</span>
                        </div>
                        <h5 class="card-title mt-2">${product.name}</h5>
                        <p class="card-text text-muted">${product.description}</p>
                        <ul class="list-group list-group-flush mb-3">
                            <li class="list-group-item">Type: ${product.type}</li>
                            <li class="list-group-item">Model: ${product.model}</li>
                            <li class="list-group-item">Price: $${product.price}</li>
                        </ul>
                        <div class="mt-auto d-grid">
                            <button class="btn btn-outline-secondary compare-btn" data-id="${product.id}">
                                Compare
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productList.appendChild(col);
        });
    })
    .catch(err => {
        console.error(err);
        productList.innerHTML = "<p class='text-danger'>Failed to load products.</p>";
    });

// Handle compare button clicks
productList.addEventListener('click', e => {
    if (e.target.classList.contains('compare-btn')) {
        const id = parseInt(e.target.dataset.id);

        // Nếu sản phẩm đã được chọn và đã có >=2 sản phẩm => chuyển trang so sánh
        if (selectedProducts.includes(id) && selectedProducts.length >= 2) {
            window.location.href = `compare_products.html?ids=${selectedProducts.join(",")}`;
            return;
        }

        // Nếu chưa chọn sản phẩm này
        if (!selectedProducts.includes(id)) {
            if (selectedProducts.length >= 3) {
                alert("You can only select up to 3 products.");
                return;
            }
            selectedProducts.push(id);
        } else {
            // Nếu bỏ chọn sản phẩm
            selectedProducts = selectedProducts.filter(pid => pid !== id);
        }

        // Cập nhật lại tất cả button
        document.querySelectorAll('.compare-btn').forEach(btn => {
            const pid = parseInt(btn.dataset.id);
            if (selectedProducts.includes(pid)) {
                btn.classList.remove('btn-outline-secondary');
                btn.classList.add('btn-success');
                if (selectedProducts.length === 3) {
                    btn.textContent = "Compare (Max Selected)";
                } else {
                    btn.textContent = `Compare (${selectedProducts.length} selected)`;
                }
            } else {
                btn.classList.remove('btn-success');
                btn.classList.add('btn-outline-secondary');
                btn.textContent = 'Compare';
            }
        });
    }
});
