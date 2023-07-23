# Stationary Importer Company - Node.js Project

Welcome to the Stationary Importer Company project! This Node.js application is built using Express, Mongoose, MongoDB, Nodemailer, and other libraries to create a platform for an imaginary stationary importer company. The main functionalities of this project include customer registration, registration confirmation by a manager, and the ability for registered customers to place orders for stationary items.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Contact](#contact)

## Introduction

The Stationary Importer Company project is designed to streamline the customer registration process and enable smooth order management for stationary items. Customers can register on the platform, and their registration requests need to be confirmed by a manager before they gain full access to the ordering system.

## Features

- **Customer Registration**: Customers can register on the platform by providing their details, including name, email, and address.

- **Manager Confirmation**: After registration, customer accounts need to be confirmed by a manager before they can place orders.

- **Order Placement**: Registered and confirmed customers can browse the available stationary items and place orders for the desired products.

- **Order Status**: Customers can view the status of their placed orders, whether they are processed, shipped, or delivered.

- **Email Notifications**: Nodemailer is integrated to send email notifications to customers when their registration is confirmed and when their order status changes.

## Installation

Follow these steps to set up the project locally:

1. Ensure you have Node.js and npm (Node Package Manager) installed on your machine.

2. Clone the repository:

   ```bash
   git clone https://github.com/se348/stationary_backend.git
   cd stationary-importer
  ```
3. Install dependencies:
   ```bash
  npm install
  ```
4. Configure MongoDB:

Install MongoDB and ensure it is running on your local machine or a remote server.
Update the MongoDB connection string in the project configuration files.

5. Configure Nodemailer:

Provide your email account credentials in the Nodemailer configuration to enable email notifications.

6. Start the application:

```bash
npm start
```

## Contact
For any questions or inquiries, you can reach us at semir2578@gmail.com. We look forward to hearing from you and hope you enjoy using our platform!
