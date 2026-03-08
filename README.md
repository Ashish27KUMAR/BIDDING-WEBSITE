# BIDZILLA - Real-Time Live Bidding Platform

**BIDZILLA** is a high-performance, real-time auction and bidding platform designed explicitly for gaming events, sports tournaments, and professional franchise drafts. 

Featuring a striking cyber-gaming UI, real-time WebSockets synchronization via Firebase, and seamless spreadsheet integrations, this platform handles the complexities of running live auctions smoothly.

![Bidzilla Platform Banner](https://placehold.co/1200x400/1e1e24/00f0ff?text=BIDZILLA+Live+Bidding+Platform)

---

## 📸 Screenshots

### 1. Landing & Authentication
*<Add a screenshot of the landing page or login screen here>*
![Landing Page Placeholder](https://placehold.co/800x400/1e1e24/ffffff?text=Landing+Page+Screenshot)

### 2. Admin Command Center (Dashboard)
*<Add a screenshot of the Admin Dashboard showing setup controls here>*
![Admin Dashboard Placeholder](https://placehold.co/800x400/1e1e24/ffffff?text=Admin+Dashboard+Screenshot)

### 3. Live Auction Room
*<Add a screenshot of the active live bidding room here>*
![Live Auction Placeholder](https://placehold.co/800x400/1e1e24/ffffff?text=Live+Auction+Room+Screenshot)

### 4. Franchise Setup & Results
*<Add a screenshot of the team registration or results table here>*
![Results Placeholder](https://placehold.co/800x400/1e1e24/ffffff?text=Results+and+Registration+Screenshot)

---

## ✨ Key Features

- **⚡ Real-Time Sync**: Instantaneous updates using Firebase Realtime Database and Firestore. Watch bids, player statuses, and budgets update directly across all connected displays.
- **🛡️ Admin Suite**: Full control over events. Set budgets, team limits, manage player rosters (bulk CSV/JSON uploads or manual entry), and control the pace of the auction.
- **👥 Team Franchises**: Custom URLs generated for team managers to directly register their franchise name and members.
- **📊 Live Leaderboards & Budgets**: Visual budget trackers for every team. Know precisely how much purse remains at a glance.
- **📉 Automated Google Sheets Sync**: Bind a Google Sheet to your event, and Bidzilla will automatically record every sale (Team, Player, Price) instantly as the hammer drops.
- **📱 Responsive Gaming UI**: Tailored with custom neon glows (`cyan-400`, `purple-500`), glassmorphism effects, and smooth Framer Motion animations. fully responsive on Mobile, Tablet, and Desktop.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, Vite
- **Routing**: React Router DOM (v6)
- **Styling**: Tailwind CSS (with custom neon/gaming layout configurations)
- **Animations & Icons**: Framer Motion, Lucide React
- **Backend & Database**: Firebase (Auth, Firestore, Realtime Database)
- **Utilities**: PapaParse (CSV Parsing), React-Toastify

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v16+)
- A Firebase Project (with Auth, Firestore, and Realtime Database enabled)

### 1. Clone the repository
```bash
git clone https://github.com/Ashish27KUMAR/BIDDING-WEBSITE.git
cd BIDDING-WEBSITE
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_realtime_database_url
VITE_GOOGLE_SHEET_URL=your_default_sheet_url_macro (optional)
```

### 4. Start the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 📖 How To Use (Quick Flow)

1. **Login** as an Admin.
2. Navigate to the **Admin Dashboard**.
3. Create a new event (Set Teams, Budget, Game Type, link a Google Sheet).
4. Share the generated **Franchise Registration Link** to team owners.
5. Upload the **Player Roster** via CSV or manual entry.
6. Once teams are registered, enter the **Live Arena**.
7. Start the auction! Proceed through players, mark them as SOLD to teams, and watch the budgets calculate automatically.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the MIT License.


