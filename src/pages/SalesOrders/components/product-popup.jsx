import { useState, useEffect } from "react"
import { Search, X, Plus } from "lucide-react"
import { config } from "../../../hooks/config"

export default function ProductPopup({ onSelectProduct, onClose, selectedProducts = [] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [apiProducts, setApiProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const excludedIds = selectedProducts.map((p) => p.ProductID)


  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500) // Espera 500ms

    return () => clearTimeout(timeout)
  }, [searchTerm])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const url = `${config.apiRest}/products?filtro=${encodeURIComponent(
          debouncedSearch
        )}&excludeIds=${encodeURIComponent(excludedIds.join(","))}`

        const response = await fetch(url)
        const data = await response.json()
        setApiProducts(data)
      } catch (error) {
        console.error("Error al obtener los productos", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [debouncedSearch, excludedIds.join(",")])

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Seleccionar Producto</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm("")}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="modal-content">
          {loading ? (
            <div className="loading-state">
              <p>Cargando productos...</p>
            </div>
          ) : apiProducts.length > 0 ? (
            <div className="product-list">
              {apiProducts.map((product) => (
                <div
                  key={product.ProductID}
                  className="product-list-item"
                  onClick={() => onSelectProduct(product)}
                >
                  <div>
                    <div className="product-list-name">{product.ProductID}</div>
                    <div className="product-list-description">{product.Name}</div>
                  </div>
                  <div className="product-list-price"><b>Stock: </b>{product.Stock}</div>
                  <div className="product-list-right">
                      <div className="product-list-price">${product.Price.toFixed(2)}</div>
                    <button className="add-btn">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
