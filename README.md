# Freetidsbanken App

## 📌 Overview
Freetidsbanken is a **loan management app** designed to handle reservations for users. It provides a streamlined interface to **browse, reserve, and manage loans** with features like **QR code check-ins, user authentication, and review system**.

## 🛠️ Features
- **User Authentication**: Users can sign in and manage their loans.
- **Item Reservations**: Browse available items and make reservations.
- **QR Code Check-In**: Generate QR codes for loan verification at stores.
- **Loan Management**: View upcoming loans, update or cancel reservations.
- **Review System**: Leave and manage reviews for loaned items.
- **Store Management**: Check loaned items and pickup locations.

## 🏗️ Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + ShadCN UI
- **State Management**: Zustand
- **Routing**: React Router
- **Database**: JSON Server (Mock API)
- **QR Code Generation**: `qrcode.react`

## 🚀 Installation
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/freetidsbanken.git
cd freetidsbanken
```
### 2️⃣ Install Dependencies
Using **Bun** (preferred):
```sh
bun install
```
Or with npm:
```sh
npm install
```
### 3️⃣ Start the App
Run both the frontend and JSON Server:
```sh
bun run dev  # Starts frontend
bun run server  # Starts JSON Server
```
The app should now be running at **`http://localhost:5173/`**.

## 📚 Usage Guide
### 🔹 Reserving an Item
1. Browse available items.
2. Click **Reserve** to add an item to your loan list.
3. View loan details and **confirm reservation**.

### 🔹 Managing Loans
- **View loans** on the **Loans Page**.
- Click **Show QR** to generate a **QR code** for pickup.
- Modify or cancel loans before the pickup date.

### 🔹 Reviewing Items
- Navigate to an item and **leave a review**.
- Edit or delete **your own reviews**.

## 🔧 Configuration
### 🔹 Changing API Endpoints
Modify `json-server.json` to update mock API routes.

### 🔹 Updating Styles
Global styles are located in `src/index.css`.

## 🛠️ Development
### Running Linting and Formatting
```sh
bun run lint  # ESLint
bun run format  # Prettier
```

### Running Tests
```sh
bun run test
```

## 📜 License
MIT License. See `LICENSE` for details.

## 💬 Feedback & Contributions
Feel free to open **issues** or submit **PRs** to improve the app! 🚀

