<div align="center">

# 🛍️ NEXORA
## Modern E-Commerce Storefront

### Discover • Explore • Shop • Enjoy

A complete, interactive, and responsive E-Commerce Mini Application built with **HTML, CSS, and Vanilla JavaScript**.

**Frontend Web Development Capstone Project**

---

![HTML5](https://img.shields.io/badge/HTML5-Structure-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![API](https://img.shields.io/badge/API-Integration-success?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Design-Fully_Responsive-blueviolet?style=for-the-badge)

### ✨ A Modern Shopping Experience Built From Scratch

</div>

---

# 🌟 About The Project

**Nexora** is a complete and interactive frontend E-Commerce Storefront designed to deliver a modern online shopping experience. This project brings together the major frontend development concepts learned throughout the internship, including **API integration, asynchronous JavaScript, DOM manipulation, reusable components, search and filtering, localStorage, form validation, dynamic rendering, and responsive design**.

Unlike a static shopping website, Nexora dynamically fetches product data from a public API and renders products directly into the user interface. Users can search for products, filter them by category, view product details, manage their shopping cart, update quantities, and continue shopping even after refreshing the page because cart data is persisted using localStorage.

This project was developed as a **Capstone Project** to demonstrate the ability to build a complete, polished, and functional frontend mini application from scratch.

---

# 🎯 Project Objective

The goal of Nexora is to combine multiple frontend development skills into one complete application.

The project focuses on building a realistic E-Commerce experience where users can:

- Browse products dynamically
- Search for products instantly
- Filter products by category
- View detailed product information
- Add products to a shopping cart
- Update product quantities
- Remove products from the cart
- View a live running total
- Save cart data using localStorage
- Complete a checkout form with validation
- Receive a successful order confirmation
- Use the application smoothly across desktop, tablet, and mobile devices

---

# ✨ Key Features

## 🛍️ Dynamic Product Listing

Products are fetched dynamically from a public API instead of being manually hardcoded into the HTML.

Each product card displays important information such as:

- Product image
- Product title
- Category
- Price
- Rating
- View Details option
- Add to Cart functionality

The products are dynamically rendered using JavaScript and DOM manipulation.

---

## 🌐 API Integration

Nexora connects to a public product API using modern JavaScript techniques.

The application uses:

- `fetch()`
- `async/await`
- `try/catch`

The application properly handles different API states including:

### ⏳ Loading State

A loading interface is displayed while product data is being fetched.

### ✅ Success State

Products are dynamically displayed after the API request is successful.

### ⚠️ Error State

If the API request fails, users receive a friendly error message with an option to retry.

This ensures that the application remains user-friendly even when network problems occur.

---

# 🔍 Smart Product Search

The application includes an interactive search system that allows users to find products quickly.

Users can search products by name, and the product list updates dynamically.

### Search Features

- Instant product searching
- Dynamic result updates
- Search works with category filtering
- Friendly empty state when no products match the search

When no matching products are found, the application displays a clear and helpful message instead of showing a broken or empty interface.

---

# 🏷️ Category Filtering

Nexora allows users to explore products by category.

Features include:

- All Products option
- Dynamic category filtering
- Clear active category state
- Smooth interaction
- Search and filtering working together

This creates a more realistic and convenient shopping experience.

---

# 📦 Product Detail View

Users can explore individual products in greater detail.

The Product Detail view displays:

- Large product image
- Product title
- Full description
- Category
- Rating information
- Product price
- Quantity controls
- Add to Cart functionality

The product information is loaded dynamically based on the selected product.

---

# 🛒 Fully Functional Shopping Cart

The shopping cart is one of the main features of Nexora.

Users can:

- ➕ Add products to the cart
- ➖ Decrease product quantity
- ➕ Increase product quantity
- 🗑️ Remove individual products
- 🔄 Update quantities dynamically
- 💰 View individual item totals
- 📊 View a live running total
- 🧹 Clear the cart when needed

The cart count in the navigation updates automatically whenever products are added or removed.

---

# 💾 Local Storage Persistence

Nexora uses the browser's **localStorage** to save shopping cart data.

This means:

> 🔄 Users can refresh the page without losing their cart.

Cart data is stored as structured JSON and restored automatically when the application starts.

The application uses:

- `localStorage.setItem()`
- `localStorage.getItem()`
- `JSON.stringify()`
- `JSON.parse()`

The user interface and stored cart data remain synchronized throughout the application.

---

# 💳 Checkout Experience

The project includes a complete frontend checkout experience.

The checkout summary displays:

- Products in the cart
- Product quantities
- Individual prices
- Subtotal
- Final total

A customer information form is also included.

### Form Fields

- Full Name
- Email Address
- Delivery Address

---

# 📝 Form Validation

The checkout form includes client-side validation.

The application:

- Prevents empty submissions
- Validates required fields
- Displays clear validation messages
- Provides helpful feedback to users

No backend or real payment system is required because this project focuses on frontend development.

---

# 🎉 Order Confirmation

After successful form validation and checkout submission, the user receives a professional order confirmation.

This creates a complete user journey:

**Browse Products → Add to Cart → Review Cart → Checkout → Order Confirmation**

---

# 🔔 Interactive Notifications

Nexora uses user-friendly notifications to provide feedback for important actions.

Notifications may appear when:

- A product is added to the cart
- A product is removed
- A quantity is updated
- The cart is cleared
- An order is successfully placed

These notifications provide immediate feedback without interrupting the user's experience.

---

# 🧩 Reusable Component Architecture

The project follows the concept of **Component Thinking**.

Instead of repeatedly writing the same HTML and JavaScript code, reusable functions are used to generate interface elements dynamically.

Examples of reusable components include:

- Product Cards
- Category Filters
- Cart Items
- Buttons
- Toast Notifications
- Loading States
- Error States
- Empty States

This approach makes the code:

- Cleaner
- Easier to maintain
- More reusable
- Easier to expand in the future

---

# ⚙️ Application Data Flow

Nexora follows a clear and organized data flow. Product data is fetched asynchronously from a public API and stored in JavaScript state before being dynamically rendered into reusable UI components. User interactions such as searching, filtering, and adding products to the cart update the application state and automatically refresh the relevant parts of the interface. Cart data is synchronized with localStorage so that products remain available even after a page refresh, creating a smooth and persistent shopping experience.

---

# 🧠 Core JavaScript Concepts Used

This project demonstrates practical use of important JavaScript concepts.

### ⚡ Asynchronous JavaScript

- `fetch()`
- `async`
- `await`
- `try/catch`

### 🌐 DOM Manipulation

- `document.querySelector()`
- `document.createElement()`
- `appendChild()`
- `innerHTML`
- `classList`
- Dynamic rendering

### 🎯 Event Handling

User interactions are managed using JavaScript event listeners.

Examples include:

- Button clicks
- Search input
- Category selection
- Quantity updates
- Form submission
- Cart actions

### 💾 Browser Storage

- localStorage
- JSON.stringify()
- JSON.parse()

### 🧩 Reusable Functions

The application uses reusable functions to avoid unnecessary code duplication.

---

# 🎨 Modern UI/UX Design

Nexora is designed with a modern and professional E-Commerce aesthetic.

The interface focuses on:

- Clean layouts
- Strong visual hierarchy
- Consistent spacing
- Modern typography
- Beautiful product cards
- Smooth hover effects
- Clear call-to-action buttons
- User-friendly empty states
- Professional feedback messages

The goal is to create an interface that feels like a real online shopping platform rather than a simple beginner project.

---

# ✨ Animations & Interactions

The application includes meaningful animations and transitions to improve the user experience.

Examples include:

- Product card hover effects
- Button transitions
- Smooth interactive feedback
- Toast notification animations
- Dynamic cart updates
- Loading animations

All animations are designed to remain subtle and professional.

---

# 📱 Fully Responsive Design

Nexora is built to work smoothly across multiple devices.

### 💻 Desktop

A complete product browsing and shopping experience with an optimized layout.

### 💼 Laptop

Flexible content arrangement and responsive spacing.

### 📟 Tablet

Product grids and interface elements adjust to the available screen size.

### 📱 Mobile

The application is optimized for smaller screens with:

- Responsive navigation
- Flexible product grids
- Easy-to-tap buttons
- Stacked layouts
- Mobile-friendly cart controls
- Responsive checkout forms
- No unnecessary horizontal scrolling

---

# 📂 Project Structure

    nexora-storefront/
    │
    ├── README.md
    ├── index.html
    ├── style.css
    └── script.js

---

# 📄 File Overview

## 🌐 index.html

Contains the main structure of the application, including:

- Navigation
- Product sections
- Dynamic content containers
- Cart views
- Checkout structure
- Footer

---

## 🎨 style.css

Handles the complete visual design of the application.

This includes:

- Layout styling
- Responsive design
- Product cards
- Navigation
- Buttons
- Cart interface
- Forms
- Animations
- Loading states
- Error states
- Mobile optimization

---

## ⚡ script.js

Contains the main functionality of Nexora.

Key responsibilities include:

- Fetching product data
- Rendering products
- Search functionality
- Category filtering
- Product details
- Shopping cart management
- Quantity updates
- Total calculations
- localStorage synchronization
- Form validation
- Notifications
- Dynamic UI updates

---

# 🚀 How To Run The Project

## Step 1 — Download or Clone the Repository

Clone the repository using Git:

    git clone https://github.com/YOUR-USERNAME/nexora-storefront.git

Or download the project as a ZIP file.

---

## Step 2 — Open the Project Folder

Open the `nexora-storefront` folder using **Visual Studio Code**.

---

## Step 3 — Open index.html

Locate and open:

    index.html

---

## Step 4 — Run Using Live Server

Install the **Live Server** extension in Visual Studio Code if it is not already installed.

Then:

1. Right-click on `index.html`
2. Select **Open with Live Server**

The application will automatically open in your browser.

🎉 **Nexora is now running!**

---

# 🧪 Functional Testing Checklist

## 🌐 API & Products

- [x] Products are fetched dynamically
- [x] Loading state is displayed
- [x] Error state is handled
- [x] Products are dynamically rendered

## 🔍 Search & Filtering

- [x] Product search works
- [x] Category filtering works
- [x] Search and filters work together
- [x] Empty search state is displayed

## 🛒 Shopping Cart

- [x] Products can be added
- [x] Products can be removed
- [x] Quantity can be increased
- [x] Quantity can be decreased
- [x] Cart count updates
- [x] Total updates live
- [x] Empty cart state works

## 💾 Data Persistence

- [x] Cart is saved in localStorage
- [x] Cart survives page refresh
- [x] Stored data is restored automatically

## 📦 Product Details

- [x] Product detail view works
- [x] Product information is displayed dynamically
- [x] Products can be added to cart from the detail view

## 💳 Checkout

- [x] Checkout summary works
- [x] Customer form is displayed
- [x] Form validation works
- [x] Order confirmation is shown

## 📱 Responsive Design

- [x] Desktop optimized
- [x] Laptop optimized
- [x] Tablet optimized
- [x] Mobile optimized

---

# 🎓 Skills Demonstrated

Through this Capstone Project, I gained practical experience in:

- 🌐 API Integration
- ⚡ Asynchronous JavaScript
- 🧩 DOM Manipulation
- 🔄 Dynamic Rendering
- 🛒 Shopping Cart Logic
- 💾 localStorage
- 🔍 Search Functionality
- 🏷️ Category Filtering
- 📝 Form Validation
- 🔔 User Notifications
- 🧩 Reusable Components
- 🎨 UI/UX Design
- 📱 Responsive Web Design
- 🧠 State Management Concepts
- 🛠️ Problem Solving

---

# 🔮 Future Improvements

Nexora can be expanded with additional features in the future, such as:

- ❤️ Wishlist functionality
- 👤 User authentication
- 🔐 Login and registration system
- 💳 Real payment integration
- 📦 Order history
- ⭐ Product reviews
- 🔔 Advanced notifications
- 🌙 Dark mode
- 🎟️ Discount coupons
- 📊 Advanced sorting options
- 🧾 Invoice generation
- 🌍 Multiple currency support

---

# 🏆 Capstone Project

Nexora was developed as a **Frontend Web Development Capstone Project**.

This project represents the combination of multiple weeks of learning and practical development experience.

It brings together:

### 🌐 API Integration
### ⚡ Async/Await
### 🧩 DOM Manipulation
### 🔍 Search & Filtering
### 🛒 Shopping Cart Logic
### 💾 localStorage
### 📝 Form Validation
### 🔄 Dynamic Rendering
### 🎨 Responsive UI/UX
### 🧩 Reusable Components

---

# 👩‍💻 Author

## Ajwa Shahid

**Frontend Web Development Intern**

Passionate about building modern, interactive, responsive, and user-friendly web applications.

---

<div align="center">

# ⭐ Thank You for Visiting Nexora!

### 🛍️ Discover More. Shop Smarter.

**Built with ❤️ using HTML, CSS & Vanilla JavaScript**

---

### If you like this project, consider giving it a ⭐ on GitHub!

</div>
