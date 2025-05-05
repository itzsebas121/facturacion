require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  connectionTimeout: 30000,
  requestTimeout: 60000 
};

app.get("/products", async (req, res) => {
  const { filtro, excludeIds } = req.query;

  try {
    await sql.connect(config);
    const request = new sql.Request();

    request.input("Filtro", sql.VarChar(100), filtro || null);
    request.input("ExcludedIDs", sql.VarChar(sql.MAX), excludeIds || null);

    const result = await request.execute("GetProducts");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/getSalesOrders", async (req, res) => {
  try {
    await sql.connect(config);
    const request = new sql.Request();

    const result = await request.execute("GetSalesOrders");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/getInvoiceDetails", async (req, res) => {
  const { orderId } = req.query; // Obtener el OrderID desde los parámetros de la consulta

  if (!orderId) {
    return res.status(400).json({ error: "Falta el parámetro OrderID" });
  }

  try {
    // Establece la conexión a la base de datos
    await sql.connect(config);

    // Consulta para obtener los detalles de la factura, el cliente y los productos
    const result = await sql.query(`
      SELECT 
        so.OrderID AS invoice_id,
        so.Date AS invoice_date,
        c.FirstName + ' ' + c.LastName AS customer_name,
        c.CustomerID AS customer_rfc,
        c.Address AS customer_address,
        c.Phone AS customer_phone,
        c.Email AS customer_email,
        p.Name AS product_name,
        sod.Price AS product_price,
        sod.Quantity AS product_quantity,
        so.Subtotal AS subtotal,
        so.IVA AS iva,
        so.Total AS total
      FROM SalesOrders so
      JOIN Customers c ON so.CustomerID = c.CustomerID
      JOIN SalesOrderDetails sod ON so.OrderID = sod.OrderID
      JOIN Products p ON sod.ProductID = p.ProductID
      WHERE so.OrderID = ${orderId}
    `);

    // Agrupar los resultados para que el formato sea el que deseas
    const invoiceData = result.recordset.reduce((acc, row) => {
      // Verificar si ya tenemos la factura en el acumulador
      if (!acc.invoice_id) {
        acc.invoice_id = row.invoice_id;
        acc.invoice_date = row.invoice_date;
        acc.customer_name = row.customer_name;
        acc.customer_rfc = row.customer_rfc;
        acc.customer_address = row.customer_address;
        acc.customer_phone = row.customer_phone;
        acc.customer_email = row.customer_email;
        acc.products = [];
        acc.subtotal = row.subtotal;
        acc.iva = row.iva;
        acc.total = row.total;
      }

      // Agregar productos al arreglo de productos
      acc.products.push({
        product_name: row.product_name,
        product_description: row.product_description,
        product_price: row.product_price,
        product_quantity: row.product_quantity,
      });

      return acc;
    }, {});

    // Enviar la respuesta en el formato deseado
    res.json(invoiceData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener los detalles de la factura" });
  } finally {
    await sql.close();
  }
});
app.get("/customers", async (req, res) => {
  const { filtro } = req.query;

  try {
    await sql.connect(config);
    const request = new sql.Request();

    if (filtro) {
      request.input("Filtro", sql.VarChar(100), filtro);
    }

    const result = await request.execute("GetCustomers");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/sales-order/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    await sql.connect(config);

    const transaction = new sql.Transaction();

    await transaction.begin();

    const request = new sql.Request(transaction);
    request.input("OrderID", sql.Int, orderId);

    await request.query("DELETE FROM SalesOrderDetail WHERE OrderID = @OrderID");

    const result = await request.query("DELETE FROM SalesOrders WHERE OrderID = @OrderID");

    await transaction.commit();

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Orden no encontrada." });
    }

    res.status(200).json({ message: "Orden eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar la orden:", error.message);
    if (transaction) await transaction.rollback();
    res.status(500).json({ message: "Error al eliminar la orden." });
  }
});

app.post("/sales-order", async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ message: "CustomerID is required" });
  }

  try {
    await sql.connect(config);
    const request = new sql.Request();

    request.input("CustomerID", sql.VarChar(10), customerId);

    const result = await request.execute("CreateSalesOrder");

    res.json({ newOrderID: result.recordset[0].NewOrderID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/sales-order-detail", async (req, res) => {
  const { orderId, productID, quantity } = req.body;

  if (!orderId || !productID || !quantity) {
    return res.status(400).json({ message: "Faltan datos requeridos." });
  }

  try {
    await sql.connect(config);
    const request = new sql.Request();

    request.input("OrderID", sql.Int, orderId); // usar Int como en el SP
    request.input("ProductID", sql.VarChar(5), productID);
    request.input("Quantity", sql.Int, quantity);

    const result = await request.execute("AddSalesOrderDetail");

    res.json({
      message: "Detalle agregado exitosamente",
      result: result.recordset,
    });
  } catch (err) {
    // Borrar orden solo si ocurrió un error
    if (orderId) {
      try {
        const delReq = new sql.Request();
        delReq.input("OrderID", sql.Int, orderId);
        await delReq.query("DELETE FROM SalesOrders WHERE OrderID = @OrderID");
      } catch (delErr) {
        console.error("Error al borrar orden fallida:", delErr.message);
      }
    }

    console.error("Error en AddSalesOrderDetail:", err.message);
    res.status(500).json({ message: "Error al agregar detalle de orden." });
  }
});
//endpoint obtener la siguiente factura
app.get("/next-sale-order", async (req, res) => {
  try {
    await sql.connect(config);
    const request = new sql.Request();

    const result = await request.query(`
      SELECT IDENT_CURRENT('SalesOrders') + IDENT_INCR('SalesOrders') AS NextOrderID;
    `);

    const nextId = result.recordset[0].NextOrderID;

    res.status(200).json({ nextOrderID: nextId });
  } catch (error) {
    console.error("Error al obtener el siguiente número de orden:", error.message);
    res.status(500).json({ message: "Error al obtener el siguiente número de orden." });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
