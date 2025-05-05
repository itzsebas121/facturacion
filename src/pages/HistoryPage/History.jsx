import { useState } from "react"
import InvoiceHistory from "./components/invoice-history"
import InvoiceDetailModal from "./components/invoice-detail-modal"
import  "./history.css"
export default function History() {
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
  }

  return (
    <div className="invoice-app">
      <div className="invoice-container history-page">
        <InvoiceHistory invoices={[]} onViewInvoice={handleViewInvoice} />

        {selectedInvoice && <InvoiceDetailModal orderId={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
      </div>
    </div>
  )
}
    