import { useState, useEffect } from "react";
import InvoiceHeader from './components/invoice-header';
import ProductsSection from './components/products-section';
import InvoiceSummary from './components/invoice-summary';
import CustomerPopup from './components/customer-popup';
import ProductPopup from './components/product-popup';
import { config } from "../../hooks/config";
import './globals.css';

export default function Home() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [newOrderID, setNewOrderID] = useState(null); 

  const fetchNextOrderID = async () => {
    try {
      const response = await fetch(`${config.apiRest}/next-sale-order`);
      const data = await response.json();
      setNewOrderID(data.nextOrderID); 
    } catch (error) {
      console.error("Error al obtener el siguiente OrderID:", error);
    }
  };

  const subtotal = selectedProducts.reduce((sum, product) => sum + product.Price * product.quantity, 0);
  const iva = subtotal * 0.12;
  const total = subtotal + iva;

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerPopup(false);
  };

  const handleClearInvoice = () => {
    setSelectedCustomer(null);
    setSelectedProducts([]);
    fetchNextOrderID(); // Actualizar el OrderID cuando se guarda la factura
  };

  const handleSelectProduct = (product) => {
    const existingProductIndex = selectedProducts.findIndex((p) => p.ProductID === product.ProductID);

    if (existingProductIndex >= 0) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingProductIndex].quantity += 1;
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }

    setShowProductPopup(false);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((product) => product.ProductID !== productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }

    const updatedProducts = selectedProducts.map((product) => {
      if (product.ProductID === productId) {
        if (newQuantity > product.Stock) {
          alert("No hay suficiente stock para la cantidad seleccionada.");
          return product;
        }
        product.quantity = newQuantity;
      }
      return product;
    });
    setSelectedProducts(updatedProducts);
  };

  return (
    <div className="invoice-app">
      <div className="invoice-container">
        <InvoiceHeader
          customer={selectedCustomer}
          onSelectCustomer={() => setShowCustomerPopup(true)}
          newOrderID={newOrderID} // Pasar el nuevo ID al encabezado
          onSaveInvoice={handleClearInvoice} // Pasar la función para guardar y actualizar el ID
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
              <InvoiceSummary subtotal={subtotal} iva={iva} total={total} selectedProducts={selectedProducts} customer={selectedCustomer} onSaveSuccess={handleClearInvoice} />
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
          selectedProducts={selectedProducts}
          onSelectProduct={handleSelectProduct}
          onClose={() => setShowProductPopup(false)}
        />
      )}
    </div>
  );
}
