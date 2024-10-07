Drop database development;
create database development;
use development;

-- Table: Currency
CREATE TABLE Currency (
    CurrencyId INT AUTO_INCREMENT PRIMARY KEY,
    CurrencyCode VARCHAR(10)
);

-- Table: Wallet
CREATE TABLE Wallet (
    WalletId INT AUTO_INCREMENT PRIMARY KEY,
    CurrencyId INT,  -- Foreign key to Currency table
    WalletName VARCHAR(255),
    FOREIGN KEY (CurrencyId) REFERENCES Currency(CurrencyId)
);

-- Table: SupportRegion
CREATE TABLE SupportRegion (
    SupportRegionId INT AUTO_INCREMENT PRIMARY KEY,
    Region VARCHAR(255)
);

-- Table: UserRole
CREATE TABLE UserRole (
    UserRoleID INT AUTO_INCREMENT PRIMARY KEY,
    UserRole VARCHAR(255)
);

-- Table: Agent
CREATE TABLE Agent (
    AgentId INT AUTO_INCREMENT PRIMARY KEY,
    AwsId VARCHAR(255),
    UserRoleId INT,  -- Foreign key to UserRole table
    FOREIGN KEY (UserRoleId) REFERENCES UserRole(UserRoleID)
);

-- Table: Note
CREATE TABLE Note (
    NoteID INT AUTO_INCREMENT PRIMARY KEY,
    Note VARCHAR(255),
    Date DATE,
    AgentID INT,  -- Foreign key to Agent table
    FOREIGN KEY (AgentID) REFERENCES Agent(AgentId)
);

-- Table: Customer
CREATE TABLE Customer (
    CustomerId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255),
    Email VARCHAR(255),
    ManyChatId VARCHAR(255),  -- Assuming array of strings for ManyChatId
    ExpireDate DATE,
    UserCountry VARCHAR(255),
    ContactLink VARCHAR(255),
    AgentId INT,  -- Foreign key to Agent table
    CardID INT,
    FOREIGN KEY (AgentId) REFERENCES Agent(AgentId)
);

-- Table: Transactions
CREATE TABLE Transactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,  -- Foreign key to Customer table
    SupportRegionID INT,  -- Foreign key to SupportRegion table
    WalletID INT,  -- Foreign key to Wallet table
    Amount FLOAT,
    PaymentCheck BOOLEAN,
    PaymentCheckTime TIMESTAMP,
    NoteID INT,  -- Foreign key to Note table
    TransactionDate TIMESTAMP,
    PaymentDenied BOOLEAN,
    Month INT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerId),
    FOREIGN KEY (SupportRegionID) REFERENCES SupportRegion(SupportRegionId),
    FOREIGN KEY (WalletID) REFERENCES Wallet(WalletId),
    FOREIGN KEY (NoteID) REFERENCES Note(NoteId)
);
CREATE TABLE ScreenShot (
    ScreenShotID INT AUTO_INCREMENT PRIMARY KEY,
    TransactionID INT,
    ScreenShotLink VARCHAR(2048),
    FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID)
);

-- Table: TransactionAgent
CREATE TABLE TransactionAgent (
    TransactionAgentID INT AUTO_INCREMENT PRIMARY KEY,
    TransactionID INT,  -- Foreign key to Transactions table
    AgentID INT,  -- Foreign key to Agent table
    LogDate TIMESTAMP,
    FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID),
    FOREIGN KEY (AgentID) REFERENCES Agent(AgentId)
);
