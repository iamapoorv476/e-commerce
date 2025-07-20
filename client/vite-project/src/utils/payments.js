// src/utils/payments.js
const loadRazorpay = (order, navigate) => {
  if (!window.Razorpay) {
    alert("Razorpay SDK not loaded. Please try again later.");
    return;
  }

  // ✅ Add debugging to check if navigate is passed correctly
  console.log("Navigate function:", typeof navigate);
  
  const options = {
    key: "rzp_test_fSJ0nG3Qhw9znn",
    amount: order.amount.toString(),
    currency: order.currency || "INR",
    name: "30DC SHOP",
    description: "Thank you for shopping!",
    order_id: order.id,
    handler: function (response) {
      alert("Payment successful! Thank you for your purchase.");
      console.log("Payment Response:", response);
      
      // ✅ Check if navigate is a function before calling
      if (typeof navigate === 'function') {
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        console.error("Navigate is not a function:", navigate);
        // Fallback to window.location
        window.location.href = '/';
      }
    },
    prefill: {
      name: "Customer Name",
      email: "email@example.com",
      contact: "9999999999",
    },
    theme: {
      color: "#3399cc",
    },
    modal: {
      ondismiss: function() {
        console.log("Payment cancelled by user");
        // ✅ Check if navigate is a function before calling
        if (typeof navigate === 'function') {
          navigate('/');
        } else {
          window.location.href = '/';
        }
      }
    }
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

export default loadRazorpay; // ✅ Make sure this is default export