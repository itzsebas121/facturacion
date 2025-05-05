import { useState, useEffect } from "react"
import { Search, FileText, Calendar, User, Eye, Download, ArrowLeft, ArrowRight } from "lucide-react"
import  { config } from "../../../hooks/config"
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString()
}

export default function InvoiceHistory({ onViewInvoice }) {
    const [invoices, setInvoices] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }


    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch(`${config.apiRest}/getsalesorders`)
                const data = await response.json()
                setInvoices(data)
            } catch (error) {
                console.error("Error al obtener las facturas:", error)
            }
        }

        fetchInvoices()
    }, [])

    const filteredInvoices = invoices.filter(
        (invoice) =>
            invoice.OrderID.toString().includes(searchTerm.toLowerCase()) ||
            invoice.NameClient.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
    }

    return (
        <div className="history-container">
            <div className="history-header">
                <h1>Historial de Facturas</h1>
                <div className="search-container">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por ID o cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {filteredInvoices.length > 0 ? (
                <>
                    <div className="invoices-table">
                        <div className="table-header">
                            <div className="table-cell id-cell">ID Factura</div>
                            <div className="table-cell date-cell">Fecha</div>
                            <div className="table-cell customer-cell">Cliente</div>
                            <div className="table-cell amount-cell">Total</div>
                            <div className="table-cell actions-cell">Acciones</div>
                        </div>
                        <div className="table-body">
                            {paginatedInvoices.map((invoice) => (
                                <div key={invoice.OrderID} className="table-row">
                                    <div className="table-cell id-cell">
                                        <div className="invoice-id">
                                            <FileText size={16} />
                                            <span>{invoice.OrderID}</span>
                                        </div>
                                    </div>
                                    <div className="table-cell date-cell">
                                        <div className="invoice-date">
                                            <Calendar size={16} />
                                            <span>{formatDate(invoice.Date)}</span>
                                        </div>
                                    </div>
                                    <div className="table-cell customer-cell">
                                        <div className="invoice-customer">
                                            <User size={16} />
                                            <span>{invoice.NameClient}</span>
                                        </div>
                                    </div>
                                    <div className="table-cell amount-cell">
                                        <span className="invoice-amount">${invoice.Total.toFixed(2)}</span>
                                    </div>
                                    <div className="table-cell actions-cell">
                                        <button className="action-btn view-btn" onClick={() => onViewInvoice(invoice)} title="Ver factura">
                                            <Eye size={16} />
                                        </button>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                <ArrowLeft size={16} />
                            </button>
                            <div className="pagination-info">
                                Página {currentPage} de {totalPages}
                            </div>
                            <button className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-history">
                    <FileText size={48} />
                    <h3>No se encontraron facturas</h3>
                    {searchTerm ? (
                        <p>No hay resultados para "{searchTerm}". Intente con otro término de búsqueda.</p>
                    ) : (
                        <p>Aún no hay facturas registradas en el sistema.</p>
                    )}
                </div>
            )}
        </div>
    )
}
