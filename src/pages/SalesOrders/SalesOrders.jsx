import { useState } from "react"
import InvoiceHeader from './components/invoice-header'
import ProductsSection from './components/products-section'
import InvoiceSummary from './components/invoice-summary'
import CustomerPopup from './components/customer-popup'
import ProductPopup from './components/product-popup'
import './globals.css'

export default function Home() {
  const [invoiceNumber, setInvoiceNumber] = useState("FAC-2023-001")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showCustomerPopup, setShowCustomerPopup] = useState(false)
  const [showProductPopup, setShowProductPopup] = useState(false)

  const subtotal = selectedProducts.reduce((sum, product) => sum + product.Price * product.quantity, 0)
  const iva = subtotal * 0.12
  const total = subtotal + iva

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
    setShowCustomerPopup(false)
  }

  const handleSelectProduct = (product) => {
    const existingProductIndex = selectedProducts.findIndex((p) => p.ProductID === product.ProductID)

    if (existingProductIndex >= 0) {
      const updatedProducts = [...selectedProducts]
      updatedProducts[existingProductIndex].quantity += 1
      setSelectedProducts(updatedProducts)
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }])
    }

    setShowProductPopup(false)
  }

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((product) => product.ProductID !== productId))
  }

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveProduct(productId)
      return
    }

    const updatedProducts = selectedProducts.map((product) =>
    {
      if (product.ProductID === productId) {
        if (newQuantity > product.Stock) {
          alert("No hay suficiente stock para la cantidad seleccionada.")
          return product;
        }
        product.quantity = newQuantity
      }
      return product;
      
    }
    )
    setSelectedProducts(updatedProducts)
  }

  return (
    <div className="invoice-app">
      <div className="invoice-container">
        <InvoiceHeader
          invoiceNumber={invoiceNumber}
          customer={selectedCustomer}
          onSelectCustomer={() => setShowCustomerPopup(true)}
        />

        <div className="invoice-body">
          <div className="invoice-columns">
            <div className="invoice-left-column">
              <ProductsSection
                products={selectedProducts}
                onAddProduct={() => setShowProductPopup(true)}
                onRemoveProduct={handleRemoveProduct}
                onUpdateQuantity={handleUpdateQuantity}
              />
            </div>

            <div className="invoice-right-column">
              <InvoiceSummary subtotal={subtotal} iva={iva} total={total} selectedProducts={selectedProducts} customer={selectedCustomer} />
            </div>
          </div>
        </div>
      </div>

      {showCustomerPopup && (
        <CustomerPopup
          onSelectCustomer={handleSelectCustomer}
          onClose={() => setShowCustomerPopup(false)}
        />
      )}

      {showProductPopup && (
        <ProductPopup
     
          onSelectProduct={handleSelectProduct}
          onClose={() => setShowProductPopup(false)}
        />
      )}
    </div>
  )
}
