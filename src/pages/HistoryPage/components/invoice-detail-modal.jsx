import { X, Printer, Download, User, Phone, Mail, MapPin, Building2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { config } from "../../../hooks/config";

export default function InvoiceDetailModal({ orderId, onClose }) {
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(false);
    const lastFetchedId = useRef(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }


    useEffect(() => {
        if (orderId && orderId !== lastFetchedId.current) {
            lastFetchedId.current = orderId;
            setLoading(true);

            fetch(`${config.apiRest}/getInvoiceDetails?orderId=${orderId.OrderID}`)
                .then((res) => res.json())
                .then((data) => {
                    setInvoice(data);
                })
                .catch((err) => console.error("Error al obtener la factura:", err))
                .finally(() => setLoading(false));
        }
    }, [orderId]);


    const handlePrintInvoice = (invoice) => {
        // Crear una ventana de impresión
        const printWindow = window.open("", "_blank")
    
        // Generar el contenido HTML para la impresión
        const printContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Factura ${invoice.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .invoice-id { font-size: 24px; font-weight: bold; color: #0f766e; }
              .date { color: #4b5563; }
              .section { margin-bottom: 20px; }
              h2 { color: #0f766e; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
              .customer-info { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
              .customer-name { font-weight: bold; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th { background-color: #f1f5f9; text-align: left; padding: 8px; }
              td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
              .summary { margin-left: auto; width: 300px; margin-top: 20px; }
              .total-row { font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="invoice-id">Factura: ${invoice.invoice_id}</div>
                <div class="date">Fecha: ${formatDate(invoice.invoice_date)}</div>
              </div>
              <div>
                <h1>Sistema de Facturación</h1>
              </div>
            </div>
            
            <div class="section">
              <h2>Cliente</h2>
              <div class="customer-info">
                <div><span class="customer-name">${invoice.customer_name}</span></div>
                <div>Cédula: ${invoice.customer_rfc}</div>
                <div>Dirección: ${invoice.customer_address}</div>
                <div>Teléfono: ${invoice.customer_phone}</div>
                <div>Email: ${invoice.customer_email}</div>
              </div>
            </div>
            
            <div class="section">
              <h2>Productos</h2>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.products
                    .map(
                      (product) => `
                    <tr>
                      <td>
                        <div>${product.product_name}</div>
                       
                      </td>
                      <td>$${product.product_price.toFixed(2)}</td>
                      <td>${product.product_quantity}</td>
                      <td>$${(product.product_price * product.product_quantity).toFixed(2)}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
              
              <div class="summary">
                <table>
                  <tr>
                    <td>Subtotal:</td>
                    <td>$${invoice.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>IVA (16%):</td>
                    <td>$${invoice.iva.toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td>Total:</td>
                    <td>$${invoice.total.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
            </div>
          </body>
          </html>
        `
    
        // Escribir el contenido en la ventana
        printWindow.document.write(printContent)
        printWindow.document.close()
    
        // Esperar a que se cargue el contenido y luego imprimir
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    return (
        <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && onClose()}>
            <div className="modal invoice-detail-modal">
                <div className="modal-header">
                    <h2>Detalle de Factura</h2>
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    {loading ? (
                        <div className="loading-indicator">
                            <p>Cargando factura...</p>
                        </div>
                    ) : invoice ? (
                        <>
                            <div className="invoice-detail-header">
                                <div className="invoice-detail-id">
                                    <h3>Factura: {invoice.invoice_id}</h3>
                                    <div className="invoice-detail-date">Fecha: {formatDate(invoice.invoice_date)}</div>
                                </div>
                                <div className="invoice-detail-actions">
                                    <button className="btn btn-sm" onClick={() => handlePrintInvoice(invoice)}>
                                        <Printer size={16} />
                                        <span>Imprimir</span>
                                    </button>
                                    
                                </div>
                            </div>

                            <div className="invoice-detail-customer">
                                <h4>Información del Cliente</h4>
                                <div className="customer-detail-grid">
                                    <div className="customer-detail-item">
                                        <User size={16} />
                                        <span>{invoice.customer_name}</span>
                                    </div>
                                    <div className="customer-detail-item">
                                        <Building2 size={16} />
                                        <span>{invoice.customer_rfc}</span>
                                    </div>
                                    <div className="customer-detail-item">
                                        <Phone size={16} />
                                        <span>{invoice.customer_phone}</span>
                                    </div>
                                    <div className="customer-detail-item">
                                        <Mail size={16} />
                                        <span>{invoice.customer_email}</span>
                                    </div>
                                    <div className="customer-detail-item address-item">
                                        <MapPin size={16} />
                                        <span>{invoice.customer_address}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="invoice-detail-products">
                                <h4>Productos</h4>
                                <div className="detail-products-table">
                                    <div className="detail-table-header">
                                        <div className="detail-table-cell product-name-cell">Producto</div>
                                        <div className="detail-table-cell product-price-cell">Precio</div>
                                        <div className="detail-table-cell product-qty-cell">Cantidad</div>
                                        <div className="detail-table-cell product-total-cell">Total</div>
                                    </div>
                                    <div className="detail-table-body">
                                        {invoice.products.map((product, index) => (
                                            <div key={index} className="detail-table-row">
                                                <div className="detail-table-cell product-name-cell">
                                                    <div className="product-name">{product.product_name}</div>
                                                </div>
                                                <div className="detail-table-cell product-price-cell">${product.product_price}</div>
                                                <div className="detail-table-cell product-qty-cell">{product.product_quantity}</div>
                                                <div className="detail-table-cell product-total-cell">
                                                    ${(product.product_price * product.product_quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="invoice-detail-summary">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${invoice.subtotal}</span>
                                </div>
                                <div className="summary-row">
                                    <span>IVA (16%)</span>
                                    <span>${invoice.iva}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>${invoice.total}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>No hay datos disponibles.</p>
                    )}

                </div>
            </div>
        </div>
    )
}
