import { Save, Printer } from "lucide-react"

export default function InvoiceSummary({ subtotal, iva, total, selectedProducts, customer }) {
  const handlePrint = () => {
    window.print()
  }
  const CreateNewOrder = (customerId, selectedProducts) => {
    const data = {
      customerId: customerId
    }
    fetch("http://localhost:3001/sales-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        const newOrderID = data.newOrderID;
        if( InsertDetailOrder(newOrderID, selectedProducts)) alert("Orden creada");
      })
      .catch(error => {
        console.error("Error al crear la orden:", error)
      })
  }
  const InsertDetailOrder = (newOrderID, selectedProducts) => {
    selectedProducts.forEach(product => {
      const data = {
        orderId: newOrderID,
        productID: product.ProductID,
        quantity: product.quantity
      }
      fetch("http://localhost:3001/sales-order-detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
        })
        .catch(error => {
          console.error("Error al crear el detalle de la orden:", error)
          return false;
        })
    })
    return true;
  }
  const handleShowProducts = () => {
    if (!customer) {
      alert("Debe seleccionar un cliente")
      return
    }
    if (selectedProducts.length === 0) {
      alert("Debe seleccionar al menos un producto")
      return
    }
    CreateNewOrder(customer.CustomerID, selectedProducts);
  }
  return (
    <div className="section summary-section">
      <div className="section-header">
        <h2>Resumen</h2>
      </div>

      <div className="section-content">
        <div className="summary-details">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>IVA (12%)</span>
            <span>${iva.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="summary-actions">
          <button className="btn btn-primary" onClick={handleShowProducts}>
            <Save size={16} />
            <span>Guardar</span>
          </button>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>
    </div>
  )
}
