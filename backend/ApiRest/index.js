require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: 10061,
  options: {
    encrypt: true, 
    trustServerCertificate: true,
  },
};

app.get('/products', async (req, res) => {
  const { filtro, excludeIds } = req.query;

  try {
    await sql.connect(config);
    const request = new sql.Request();

    request.input('Filtro', sql.VarChar(100), filtro || null);
    request.input('ExcludedIDs', sql.VarChar(sql.MAX), excludeIds || null);

    const result = await request.execute('GetProducts');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/customers', async (req, res) => {
  const { filtro } = req.query;

  try {
    await sql.connect(config);
    const request = new sql.Request();

    if (filtro) {
      request.input('Filtro', sql.VarChar(100), filtro);
    }

    const result = await request.execute('GetCustomers');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//POST
app.post('/sales-order', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ message: 'CustomerID is required' });
  }

  try {
    await sql.connect(config);
    const request = new sql.Request();

    request.input('CustomerID', sql.VarChar(10), customerId);

    const result = await request.execute('CreateSalesOrder');

    res.json({ newOrderID: result.recordset[0].NewOrderID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/sales-order-detail', async (req, res) => {
  const { orderId, productID, quantity } = req.body;

  if (!orderId || !productID || !quantity) {
    return res.status(400).json({ message: 'Faltan datos requeridos.' });
  }

  try {
    await sql.connect(config);
    const request = new sql.Request();

    request.input('OrderID', sql.Int, orderId); // usar Int como en el SP
    request.input('ProductID', sql.VarChar(5), productID);
    request.input('Quantity', sql.Int, quantity);

    const result = await request.execute('AddSalesOrderDetail');

    res.json({ message: 'Detalle agregado exitosamente', result: result.recordset });
  } catch (err) {
    // Borrar orden solo si ocurrió un error
    if (orderId) {
      try {
        const delReq = new sql.Request();
        delReq.input('OrderID', sql.Int, orderId);
        await delReq.query('DELETE FROM SalesOrders WHERE OrderID = @OrderID');
      } catch (delErr) {
        console.error('Error al borrar orden fallida:', delErr.message);
      }
    }

    console.error('Error en AddSalesOrderDetail:', err.message);
    res.status(500).json({ message: 'Error al agregar detalle de orden.' });
  }
});


app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
