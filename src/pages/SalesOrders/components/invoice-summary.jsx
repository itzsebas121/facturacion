import { Save, Printer } from "lucide-react"
import { config } from "../../../hooks/config";

export default function InvoiceSummary({ subtotal, iva, total, selectedProducts, customer, onSaveSuccess }) {

  const CreateNewOrder = async (customerId, selectedProducts) => {
    const data = {
      customerId: customerId
    };
    try {
      const response = await fetch(`${config.apiRest}/sales-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      const newOrderID = result.newOrderID;
  
      const detallesOK = await InsertDetailOrder(newOrderID, selectedProducts);
      if (detallesOK) {
        onSaveSuccess()
        alert("Factura guardada exitosamente");
      } else {

        alert("Error al agregar productos a la orden, revise el stock de productos");
        DeleteOrder(newOrderID);
      }
  
    } catch (error) {
      console.error("Error al crear la orden:", error);
    }
  };
  const DeleteOrder = async (newOrderID) => {
    try {
      const response = await fetch(`${config.apiRest}/sales-order/${newOrderID}`, {
        method: "DELETE"
      });
      if (response.ok) {
        console.log("Orden eliminada correctamente");
      } else {
        console.error("Error al eliminar la orden");
      }
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
    }
  };
  const InsertDetailOrder = async (newOrderID, selectedProducts) => {
    try {
      const results = await Promise.all(
        selectedProducts.map(product => {
          const data = {
            orderId: newOrderID,
            productID: product.ProductID,
            quantity: product.quantity
          };
          return fetch(`${config.apiRest}/sales-order-detail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          }).then(response => response.json());
        })
      );
  
      const hasError = results.some(res => res.message === "Error al agregar detalle de orden.");
      return !hasError;
  
    } catch (error) {
      console.error("Error al crear el detalle de la orden:", error);
      return false;
    }
  };
  
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

        </div>
      </div>
    </div>
  )
}
