import { useState, useEffect } from "react"
import { Search, X, Check } from "lucide-react"

export default function CustomerPopup({ onSelectCustomer, onClose }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)

  const filteredCustomers = customers.filter((customer) =>
    (`${customer.FirstName} ${customer.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
     customer.CustomerID.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const url = `http://localhost:3001/customers?filtro=${searchTerm}`

        const response = await fetch(url)
        const data = await response.json()
        setCustomers(data)
      } catch (error) {
        console.error("Error al obtener los clientes", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [searchTerm])


  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Seleccionar Cliente</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre o ID..."
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
          {filteredCustomers.length > 0 ? (
            <div className="customer-list">
              {filteredCustomers.map((customer) => (
                <div key={customer.CustomerID} className="customer-list-item" onClick={() => onSelectCustomer(customer)}>
                  <div>
                    <div className="customer-list-name">{customer.FirstName} {customer.LastName}</div>
                    <div className="customer-list-rfc">{customer.CustomerID}</div>
                    <div className="customer-list-details">
                      {customer.Address} • {customer.Phone}
                    </div>
                  </div>
                  <button className="select-btn">
                    <Check size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No se encontraron clientes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
