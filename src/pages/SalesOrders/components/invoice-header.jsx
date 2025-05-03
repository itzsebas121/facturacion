import { FileText, User, UserPlus, MapPin, Phone, Mail, Building2 } from "lucide-react"

export default function InvoiceHeader({ invoiceNumber, customer, onSelectCustomer }) {
  return (
    <div className="invoice-header">
      <div className="header-top">
        <div className="company-info">
          <h1>Sistema de Facturación</h1>
        </div>
        <div className="invoice-info">
          <div className="invoice-number">
            <FileText size={16} />
            <span>Factura: </span>
            <strong>{invoiceNumber}</strong>
          </div>
          <div className="invoice-date">
            <span>Fecha: </span>
            <strong>{new Date().toLocaleDateString()}</strong>
          </div>
        </div>
      </div>

      <div className="header-customer">
        <div className="customer-header">
          <div className="customer-title">
            <User size={16} />
            <h2>Cliente </h2>
          </div>
          <button onClick={onSelectCustomer} className="btn btn-sm">
            {customer ? (
              "Cambiar cliente"
            ) : (
              <>
                <UserPlus size={14} /> Seleccionar cliente
              </>
            )}
          </button>
        </div>

        {customer ? (
          <div className="customer-card">
            <div className="customer-card-main">
              <div className="customer-name"> {customer.FirstName} {customer.LastName}</div>
              <div className="customer-rfc">
                <Building2 size={14} />
                <span>Cedula: {customer.CustomerID}</span>
              </div>
            </div>
            <div className="customer-card-details">
              <div className="customer-detail">
                <MapPin size={14} />
                <span>{customer.Address}</span>
              </div>
              <div className="customer-detail">
                <Phone size={14} />
                <span>{customer.Phone}</span>
              </div>
              <div className="customer-detail">
                <Mail size={14} />
                <span>{customer.Email}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="customer-empty">
            <p>No se ha seleccionado ningún cliente</p>
          </div>
        )}
      </div>
    </div>
  )
}
