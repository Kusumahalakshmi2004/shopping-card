// src/App.js
import React, { useState, useEffect } from "react";
import { PRODUCTS, FREE_GIFT, THRESHOLD } from "./data";
import "./App.css";

function App() {
  // State for product quantities (for the quantity selector in the product list)
  const [quantities, setQuantities] = useState(
    PRODUCTS.reduce((acc, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );

  // State for the cart
  const [cart, setCart] = useState([]);

  // State for the free gift message
  const [giftMessage, setGiftMessage] = useState("");

  // Calculate subtotal of the cart (excluding the free gift)
  const calculateSubtotal = () => {
    return cart
      .filter((item) => item.id !== FREE_GIFT.id)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Handle free gift logic using useEffect
  useEffect(() => {
    const subtotal = calculateSubtotal();
    const hasFreeGift = cart.some((item) => item.id === FREE_GIFT.id);

    if (subtotal >= THRESHOLD && !hasFreeGift) {
      setCart([...cart, { ...FREE_GIFT, quantity: 1 }]);
      setGiftMessage("Congratulations! You've earned a free Wireless Mouse!");
    } else if (subtotal < THRESHOLD && hasFreeGift) {
      setCart(cart.filter((item) => item.id !== FREE_GIFT.id));
      setGiftMessage("");
    }
  }, [cart]);

  // Handle quantity change in the product list
  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(0, prev[productId] + delta); // Prevent negative quantities
      return { ...prev, [productId]: newQuantity };
    });
  };

  // Handle adding a product to the cart
  const addToCart = (product) => {
    const quantity = quantities[product.id];
    if (quantity === 0) return; // Don't add if quantity is 0

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    // Reset the quantity selector after adding to cart
    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
  };

  // Handle quantity change in the cart
  const updateCartQuantity = (productId, delta) => {
    setCart(
      cart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Handle removing a product from the cart (except the free gift)
  const removeFromCart = (productId) => {
    if (productId === FREE_GIFT.id) return; // Prevent removing the free gift
    setCart(cart.filter((item) => item.id !== productId));
  };

  const subtotal = calculateSubtotal();
  const progress = Math.min((subtotal / THRESHOLD) * 100, 100);

  return (
    <div className="app">
      <h1>Shopping Cart</h1>

      {/* Products List */}
      <div className="products">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="product">
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <div className="quantity-selector">
              <button
                onClick={() => handleQuantityChange(product.id, -1)}
                disabled={quantities[product.id] === 0}
              >
                -
              </button>
              <span>{quantities[product.id]}</span>
              <button onClick={() => handleQuantityChange(product.id, 1)}>
                +
              </button>
            </div>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="cart-summary">
        <h2>Cart Summary</h2>
        <p>Subtotal: ₹{subtotal}</p>
        {subtotal < THRESHOLD && (
          <div>
            <p>Add ₹{THRESHOLD - subtotal} more to get a FREE Wireless Mouse!</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        {giftMessage && <p className="gift-message">{giftMessage}</p>}
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        <h2>Cart Items</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty. Add some products to see them here!</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <p>
                {item.name} - ₹{item.price} x {item.quantity} = ₹
                {item.price * item.quantity}
              </p>
              {item.id !== FREE_GIFT.id && (
                <div className="cart-controls">
                  <button
                    onClick={() => updateCartQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateCartQuantity(item.id, 1)}
                  >
                    +
                  </button>
                  <button onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
