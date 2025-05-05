import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react"
import { config } from "../../../hooks/config"

export default function ProductsSection({ products, onAddProduct, onRemoveProduct, onUpdateQuantity }) {

  return (
    <div className="section">
      <div className="section-header">
        <h2>
          <ShoppingBag size={18} />
          <span>Productos</span>
        </h2>
        <button onClick={onAddProduct} className="btn">
          <Plus size={16} /> Agregar
        </button>
      </div>

      <div className="section-content">
        {products.length > 0 ? (
          <div className="products-list">
            {products.map((product) => (
              <div key={product.ProductID} className="product-item">
                <div className="product-details">
                  <div className="product-name">{product.ProductID}</div>
                  <div className="product-description">{product.Name}</div>
                </div>
                <div className="product-price">${product.Price.toFixed(2)}</div>
                <div className="product-quantity">
                  <button onClick={() => onUpdateQuantity(product.ProductID, product.quantity - 1)} className="quantity-btn">
                    <Minus size={14} />
                  </button>
                  <span>{product.quantity}</span>
                  <button onClick={() => onUpdateQuantity(product.ProductID, (product.quantity + 1))} className="quantity-btn">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="product-total">${(product.Price * product.quantity).toFixed(2)}</div>
                <button
                  onClick={() => {
                    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
                      onRemoveProduct(product.ProductID)
                    }
                  }
                  }
                  className="remove-btn"
                  aria-label="Eliminar producto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <ShoppingBag size={24} />
            <p>Agregue productos a la factura</p>
          </div>
        )}
      </div>
    </div>
  )
}
