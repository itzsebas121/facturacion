CREATE TABLE Customers (
    CustomerID VARCHAR(10) PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Phone VARCHAR(15),
    Address VARCHAR(255)
);

CREATE TABLE Products (
    ProductID VARCHAR(5) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Stock INT NOT NULL CHECK (Stock >= 0)
);

CREATE TABLE SalesOrders (
    OrderID INT PRIMARY KEY IDENTITY,
    CustomerID VARCHAR(10) FOREIGN KEY REFERENCES Customers(CustomerID),
    Date DATE NOT NULL,
    IVA DECIMAL(10, 2) NOT NULL,
    Subtotal DECIMAL(10, 2) NOT NULL,
    Total DECIMAL(10, 2) NOT NULL,
);

CREATE TABLE SalesOrderDetails (
    DetailID INT PRIMARY KEY IDENTITY,
    OrderID INT FOREIGN KEY REFERENCES SalesOrders(OrderID),
    ProductID VARCHAR(5) FOREIGN KEY REFERENCES Products(ProductID),
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Price DECIMAL(10, 2) NOT NULL,
    IVA DECIMAL(10, 2) NOT NULL,
    Subtotal DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARBINARY(64) NOT NULL
);

INSERT INTO
    Users (Username, PasswordHash)
VALUES
    (
        'sebas',
        HASHBYTES('SHA2_256', CONVERT(VARBINARY, 'xdsebas12'))
    );

GO
;

---------------------------------------------------
CREATE PROCEDURE ValidateUser @Username VARCHAR(50),
@Password VARCHAR(100) AS BEGIN
SET
    NOCOUNT ON;
DECLARE @PasswordHash VARBINARY(64);
SET
    @PasswordHash = HASHBYTES('SHA2_256', CONVERT(VARBINARY, @Password));

SELECT
    UserID,
    Username
FROM
    Users
WHERE
    Username = @Username
    AND PasswordHash = @PasswordHash;

END;

GO;
EXEC CreateSalesOrder @CustomerID = '1017702564';

-- Procedimiento para crear una nueva orden de venta
CREATE PROCEDURE CreateSalesOrder @CustomerID VARCHAR(10) AS BEGIN
SET
    NOCOUNT ON;
INSERT INTO
    SalesOrders (CustomerID, Date, IVA, Subtotal, Total)
VALUES
    (@CustomerID, GETDATE(), 0.00, 0.00, 0.00);
SELECT
    SCOPE_IDENTITY() AS NewOrderID;

END;

GO
;

CREATE
or alter PROCEDURE AddSalesOrderDetail @OrderID INT,
@ProductID VARCHAR(5),
@Quantity INT AS BEGIN
SET
    NOCOUNT ON;

DECLARE @Price DECIMAL(10, 2),
@SubtotalProduct DECIMAL(10, 2),
@IVAProduct DECIMAL(10, 2),
@OrderExists BIT,
@ProductExists BIT,
@Stock INT,
@NewSubtotal DECIMAL(10, 2),
@NewIVA DECIMAL(10, 2);

-- Check if product exists and get price & stock
SELECT
    @Price = Price,
    @Stock = Stock
FROM
    Products
WHERE
    ProductID = @ProductID;

IF @Price IS NULL BEGIN RAISERROR('Product does not exist.', 16, 1);

RETURN;

END -- Validate stock
IF @Quantity > @Stock BEGIN RAISERROR('Insufficient stock for the product.', 16, 1);

RETURN;

END -- Calculate product subtotal and IVA
SET
    @SubtotalProduct = @Price * @Quantity;

SET
    @IVAProduct = @SubtotalProduct * 0.12;

-- Insert order detail
INSERT INTO
    SalesOrderDetails (
        OrderID,
        ProductID,
        Quantity,
        Price,
        IVA,
        Subtotal
    )
VALUES
    (
        @OrderID,
        @ProductID,
        @Quantity,
        @Price,
        @IVAProduct,
        (@SubtotalProduct + @IVAProduct)
    );

-- Update product stock
UPDATE
    Products
SET
    Stock = Stock - @Quantity
WHERE
    ProductID = @ProductID;

-- Get current totals
SELECT
    @NewSubtotal = Subtotal + @SubtotalProduct,
    @NewIVA = IVA + @IVAProduct
FROM
    SalesOrders
WHERE
    OrderID = @OrderID;

-- Update order totals correctly
UPDATE
    SalesOrders
SET
    Subtotal = @NewSubtotal,
    IVA = @NewIVA,
    Total = @NewSubtotal + @NewIVA
WHERE
    OrderID = @OrderID;

END;

EXEC CreateSalesOrder @CustomerID = '1017702564';

GO
;

--
CREATE OR ALTER PROCEDURE GetProducts
    @Filtro VARCHAR(100) = NULL,
    @ExcludedIDs VARCHAR(MAX) = NULL  -- lista CSV: 'P001,P002,P005'
AS
BEGIN
    SET NOCOUNT ON;

    -- Parse CSV into table
    DECLARE @ExcludedTable TABLE (ProductID VARCHAR(10));

    IF @ExcludedIDs IS NOT NULL
    BEGIN
        INSERT INTO @ExcludedTable (ProductID)
        SELECT TRIM(value)
        FROM STRING_SPLIT(@ExcludedIDs, ',');
    END

    SELECT *
    FROM Products
    WHERE
        (
            @Filtro IS NULL
            OR LOWER(ProductID) LIKE LOWER('%' + @Filtro + '%')
            OR LOWER(Name) IS NULL
            OR LOWER(Name) LIKE LOWER('%' + @Filtro + '%')
        )
        AND (
            @ExcludedIDs IS NULL
            OR ProductID NOT IN (SELECT ProductID FROM @ExcludedTable)
        )
        AND(Stock > 0)
END;

CREATE OR ALTER PROCEDURE GetSalesOrders
AS
BEGIN
    SET NOCOUNT ON;

    SELECT so.OrderID, so.Date, (c.FirstName+' '+ c.LastName) as NameClient, so.Total
    FROM SalesOrders so
    INNER JOIN Customers c ON so.CustomerID = c.CustomerID
   
END;


CREATE
OR ALTER PROCEDURE GetCustomers @Filtro VARCHAR(100) = NULL AS BEGIN
SELECT
    *
FROM
    Customers
WHERE
    @Filtro IS NULL
    OR LOWER(CustomerID) LIKE LOWER('%' + @Filtro + '%')
    OR LOWER(FirstName + ' ' + LastName) LIKE LOWER('%' + @Filtro + '%')
END -------
INSERT INTO
    Customers (
        CustomerID,
        FirstName,
        LastName,
        Email,
        Phone,
        Address
    )
VALUES
    (
        '1017702564',
        'Luis',
        'Martinez',
        'luis.martinez@example.com',
        '5556011701',
        '202 Birch Blvd'
    ),
    (
        '2233688346',
        'David',
        'Gonzalez',
        'david.gonzalez@example.com',
        '5554268016',
        '202 Birch Blvd'
    ),
    (
        '3555386254',
        'Carlos',
        'Martinez',
        'carlos.martinez@example.com',
        '5556806118',
        '101 Maple Lane'
    ),
    (
        '6850493886',
        'Carlos',
        'Sanchez',
        'carlos.sanchez@example.com',
        '5556562892',
        '202 Birch Blvd'
    ),
    (
        '4354441124',
        'David',
        'Smith',
        'david.smith@example.com',
        '5556676997',
        '123 Elm Street'
    ),
    (
        '5237389121',
        'David',
        'Lopez',
        'david.lopez@example.com',
        '5553576036',
        '456 Oak Avenue'
    ),
    (
        '6676865909',
        'Luis',
        'Garcia',
        'luis.garcia@example.com',
        '5552912183',
        '101 Maple Lane'
    ),
    (
        '2432754070',
        'Laura',
        'Lopez',
        'laura.lopez@example.com',
        '5554244368',
        '789 Pine Road'
    ),
    (
        '8607883494',
        'Luis',
        'Smith',
        'luis.smith@example.com',
        '5552339631',
        '101 Maple Lane'
    ),
    (
        '3678742184',
        'Jane',
        'Garcia',
        'jane.garcia@example.com',
        '5556275295',
        '456 Oak Avenue'
    );

INSERT INTO
    Products (ProductID, Name, Price, Stock)
VALUES
    ('W5MPR', 'Mouse', 139.98, 33),
    ('KP3YY', 'USB-C Cable', 500.0, 23),
    ('W0MLP', 'Charger', 306.98, 30),
    ('GX61W', 'USB-C Cable', 174.33, 36),
    ('LQPZI', 'Mouse', 720.24, 79),
    ('9O0WX', 'Headphones', 228.44, 14),
    ('8GTFZ', 'Keyboard', 734.5, 59),
    ('0DFJ8', 'Keyboard', 349.25, 54),
    ('7U4UD', 'Monitor', 492.0, 71),
    ('MXYNQ', 'Keyboard', 125.1, 20);