-- Drop and create the development database
DROP DATABASE IF EXISTS development;
CREATE DATABASE development;
USE development;

-- Create Currency table and insert demo data
CREATE TABLE Currency (
    CurrencyId INT AUTO_INCREMENT PRIMARY KEY,
    CurrencyCode VARCHAR(10)
);


-- Create Wallet table and insert demo data
CREATE TABLE Wallet (
    WalletId INT AUTO_INCREMENT PRIMARY KEY,
    CurrencyId INT,
    WalletName VARCHAR(255),
    FOREIGN KEY (CurrencyId) REFERENCES Currency(CurrencyId)
);


-- Create SupportRegion table and insert demo data
CREATE TABLE SupportRegion (
    SupportRegionID INT AUTO_INCREMENT PRIMARY KEY,
    Region VARCHAR(255)
);


-- Create UserRole table and insert demo data
CREATE TABLE UserRole (
    UserRoleID INT AUTO_INCREMENT PRIMARY KEY,
    UserRole VARCHAR(255)
);

INSERT INTO UserRole (UserRole) VALUES 
('Support Agent'),
('Admin'),
('Payment Processor');

-- Create Agent table and insert demo data
CREATE TABLE Agent (
    AgentId INT AUTO_INCREMENT PRIMARY KEY,
    AwsId VARCHAR(255),
    UserRoleId INT,
    FOREIGN KEY (UserRoleId) REFERENCES UserRole(UserRoleID)
);


-- Create Note table and insert demo data
CREATE TABLE Note (
    NoteID INT AUTO_INCREMENT PRIMARY KEY,
    Note VARCHAR(255),
    Date DATE,
    AgentID INT,
    FOREIGN KEY (AgentID) REFERENCES Agent(AgentId)
);

-- Create Customer table and insert demo data
CREATE TABLE Customer (
    CustomerId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255),
    Email VARCHAR(255),
    ManyChatId VARCHAR(255),
    ExpireDate DATE,
    UserCountry VARCHAR(255),
    ContactLink VARCHAR(255),
    AgentId INT,
    CardID INT,
    FOREIGN KEY (AgentId) REFERENCES Agent(AgentId)
);


-- Create Transactions table and insert demo data
CREATE TABLE Transactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    SupportRegionID INT,
    WalletID INT,
    Amount FLOAT,
    PaymentCheck BOOLEAN,
    PaymentCheckTime TIMESTAMP,
    NoteID INT,
    TransactionDate TIMESTAMP,
    PaymentDenied BOOLEAN,
    Month INT,
    HopeFuelID INT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerId),
    FOREIGN KEY (SupportRegionID) REFERENCES SupportRegion(SupportRegionID),
    FOREIGN KEY (WalletID) REFERENCES Wallet(WalletId),
    FOREIGN KEY (NoteID) REFERENCES Note(NoteID)
);

-- Create ScreenShot table and insert demo data
CREATE TABLE ScreenShot (
    ScreenShotID INT AUTO_INCREMENT PRIMARY KEY,
    TransactionID INT,
    ScreenShotLink VARCHAR(2048),
    FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID)
);


-- Create TransactionAgent table and insert demo data
CREATE TABLE TransactionAgent (
    TransactionAgentID INT AUTO_INCREMENT PRIMARY KEY,
    TransactionID INT,
    AgentID INT,
    LogDate TIMESTAMP,
    FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID),
    FOREIGN KEY (AgentID) REFERENCES Agent(AgentId)
);
