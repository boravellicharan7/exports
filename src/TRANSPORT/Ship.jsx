import React, { useState, useEffect, useCallback } from 'react';
import './Ship.css'; // We'll create this CSS file next

const BookingComponent = () => {
    const [name, setName] = useState('');
    const [fromEmail, setFromEmail] = useState('');
    const [toEmail, setToEmail] = useState('');
    const [startCountry, setStartCountry] = useState('');
    const [startPort, setStartPort] = useState('');
    const [endCountry, setEndCountry] = useState('');
    const [endPort, setEndPort] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [cost, setCost] = useState(0);
    const [shippingInvoice, setShippingInvoice] = useState('');
    const [invoiceType, setInvoiceType] = useState('');
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [startAvailablePorts, setStartAvailablePorts] = useState([]);
    const [endAvailablePorts, setEndAvailablePorts] = useState([]);
    const [minDate, setMinDate] = useState('');
    const [baseTax, setBaseTax] = useState(0);
    const [countryTax, setCountryTax] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    
    // New states for weight and payment
    const [weight, setWeight] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    
    // Expanded countries and ports data
    const portsData = {
        'USA': ['New York', 'Los Angeles', 'Miami', 'Seattle', 'Houston', 'Charleston'],
        'UK': ['London', 'Liverpool', 'Southampton', 'Dover', 'Felixstowe', 'Portsmouth'],
        'China': ['Shanghai', 'Shenzhen', 'Guangzhou', 'Ningbo', 'Qingdao', 'Xiamen'],
        'Singapore': ['Singapore Harbor', 'Jurong', 'Tuas', 'Pasir Panjang', 'Keppel', 'Sembawang']
    };
    
    // Country-specific tax rates (percentage)
    const countryTaxRates = {
        'USA': 5,
        'UK': 7.5,
        'China': 9,
        'Singapore': 3
    };
    
    // Base tax rate (percentage)
    const baseTaxRate = 2;
    
    // Product categories
    const productCategories = [
        'Electronics', 
        'Apparel', 
        'Automotive', 
        'Furniture', 
        'Chemicals', 
        'Food & Beverages',
        'Machinery',
        'Medical Supplies'
    ];
    
    // Invoice types (expanded)
    const invoiceTypes = [
        { id: 'commercial', name: 'Commercial Invoice' },
        { id: 'proforma', name: 'Proforma Invoice' },
        { id: 'customs', name: 'Customs Invoice' },
        { id: 'consular', name: 'Consular Invoice' },
        { id: 'certified', name: 'Certified Invoice' },
        { id: 'electronic', name: 'Electronic Invoice' },
        { id: 'timesheet', name: 'Timesheet Invoice' },
        { id: 'debit', name: 'Debit Note' },
        { id: 'credit', name: 'Credit Note' },
        { id: 'selfBilling', name: 'Self-Billing Invoice' }
    ];
    
    // Set minimum date to today
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setMinDate(formattedDate);
    }, []);
    
    // Train ports data - moved outside the useEffect for better performance
    const trainPorts = {
        'USA': ['New York', 'Los Angeles', 'Houston'],
        'UK': ['London', 'Liverpool'],
        'China': ['Shanghai', 'Guangzhou', 'Ningbo'],
        'Singapore': ['Singapore Harbor', 'Jurong']
    };
    
    // Update available ports based on selected countries and transport mode
    useEffect(() => {
        if (startCountry && shippingInvoice) {
            // Filter ports based on transport mode availability
            let availablePorts = portsData[startCountry] || [];
            
            // For train transport, limit to certain ports (simulating real-world constraints)
            if (shippingInvoice === 'Train') {
                availablePorts = trainPorts[startCountry] || [];
            }
            
            setStartAvailablePorts(availablePorts);
            // Reset port if the currently selected one isn't available
            if (startPort && !availablePorts.includes(startPort)) {
                setStartPort('');
            }
        } else {
            setStartAvailablePorts([]);
        }
    }, [startCountry, shippingInvoice, startPort]);
    
    // Update end ports based on end country and exclude the start port
    useEffect(() => {
        if (endCountry) {
            let availablePorts = portsData[endCountry] || [];
            
            // If start and end countries are the same, remove the selected start port
            if (startCountry === endCountry && startPort) {
                availablePorts = availablePorts.filter(port => port !== startPort);
            }
            
            // For train transport, limit to certain ports
            if (shippingInvoice === 'Train') {
                availablePorts = trainPorts[endCountry] || [];
                
                // Still need to filter out the start port if applicable
                if (startCountry === endCountry && startPort) {
                    availablePorts = availablePorts.filter(port => port !== startPort);
                }
            }
            
            setEndAvailablePorts(availablePorts);
            // Reset port if the currently selected one isn't available
            if (endPort && !availablePorts.includes(endPort)) {
                setEndPort('');
            }
        } else {
            setEndAvailablePorts([]);
        }
    }, [endCountry, startCountry, startPort, shippingInvoice, endPort]);
    
    // Calculate costs and taxes - memoized with useCallback for better performance
    const calculateCosts = useCallback(() => {
        if (startCountry && endCountry && shippingInvoice && invoiceType && productCategory && weight) {
            // Base cost calculation
            const distanceMultiplier = startCountry === endCountry ? 1 : 2.5;
            let baseCost = 0;
            
            // Transport-based cost
            switch (shippingInvoice) {
                case 'Air':
                    baseCost = 500 * distanceMultiplier;
                    break;
                case 'Ship':
                    baseCost = 300 * distanceMultiplier;
                    break;
                case 'Train':
                    baseCost = 200 * distanceMultiplier;
                    break;
                default:
                    baseCost = 0;
            }
            
            // Product category multiplier
            let categoryMultiplier = 1;
            switch (productCategory) {
                case 'Electronics':
                    categoryMultiplier = 1.4;
                    break;
                case 'Chemicals':
                    categoryMultiplier = 1.6;
                    break;
                case 'Medical Supplies':
                    categoryMultiplier = 1.3;
                    break;
                case 'Food & Beverages':
                    categoryMultiplier = 1.5;
                    break;
                default:
                    categoryMultiplier = 1;
            }
            
            // Invoice type multiplier
            let invoiceMultiplier = 1;
            
            switch (invoiceType) {
                case 'commercial':
                    invoiceMultiplier = 1.2;
                    break;
                case 'proforma':
                    invoiceMultiplier = 1.0;
                    break;
                case 'customs':
                    invoiceMultiplier = 1.3;
                    break;
                case 'consular':
                    invoiceMultiplier = 1.5;
                    break;
                case 'certified':
                    invoiceMultiplier = 1.4;
                    break;
                case 'electronic':
                    invoiceMultiplier = 0.9;
                    break;
                default:
                    invoiceMultiplier = 1.1;
            }
            
            // Weight-based calculation (additional cost per kg)
            const weightValue = parseFloat(weight) || 0;
            const weightCost = weightValue * 2; // $2 per kg
            
            // Calculate base cost
            const calculatedCost = (baseCost * categoryMultiplier * invoiceMultiplier) + weightCost;
            
            // Calculate taxes
            const calculatedBaseTax = calculatedCost * (baseTaxRate / 100);
            const destinationTaxRate = countryTaxRates[endCountry] || 0;
            const calculatedCountryTax = calculatedCost * (destinationTaxRate / 100);
            const calculatedTotalTax = calculatedBaseTax + calculatedCountryTax;
            
            // Return all calculated values
            return {
                cost: calculatedCost,
                baseTax: calculatedBaseTax,
                countryTax: calculatedCountryTax,
                totalTax: calculatedTotalTax,
                totalCost: calculatedCost + calculatedTotalTax
            };
        }
        
        // Default values if conditions aren't met
        return {
            cost: 0,
            baseTax: 0,
            countryTax: 0,
            totalTax: 0,
            totalCost: 0
        };
    }, [startCountry, endCountry, shippingInvoice, invoiceType, productCategory, weight]);
    
    // Update costs when relevant inputs change
    useEffect(() => {
        const costs = calculateCosts();
        setCost(costs.cost);
        setBaseTax(costs.baseTax);
        setCountryTax(costs.countryTax);
        setTotalTax(costs.totalTax);
        setTotalCost(costs.totalCost);
    }, [calculateCosts]);
    
    // Validate form data
    const validateForm = () => {
        const errors = {};
        
        if (!name.trim()) errors.name = "Name is required";
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!fromEmail.trim()) {
            errors.fromEmail = "Sender email is required";
        } else if (!emailRegex.test(fromEmail)) {
            errors.fromEmail = "Invalid email format";
        }
        
        if (!toEmail.trim()) {
            errors.toEmail = "Recipient email is required";
        } else if (!emailRegex.test(toEmail)) {
            errors.toEmail = "Invalid email format";
        }
        
        if (!startCountry) errors.startCountry = "Origin country is required";
        if (!startPort) errors.startPort = "Origin port is required";
        if (!endCountry) errors.endCountry = "Destination country is required";
        if (!endPort) errors.endPort = "Destination port is required";
        if (!deliveryDate) errors.deliveryDate = "Delivery date is required";
        if (!shippingInvoice) errors.shippingInvoice = "Transport mode is required";
        if (!productName.trim()) errors.productName = "Product name is required";
        if (!productCategory) errors.productCategory = "Product category is required";
        if (!invoiceType) errors.invoiceType = "Invoice type is required";
        
        // Validate weight
        if (!weight) {
            errors.weight = "Weight is required";
        } else if (isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
            errors.weight = "Weight must be a positive number";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    // Validate payment information
    const validatePayment = () => {
        const errors = {};
        
        if (!cardNumber.trim()) {
            return "Card number is required";
        } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            return "Invalid card number";
        }
        
        if (!expiryDate.trim()) {
            return "Expiry date is required";
        } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            return "Invalid format (MM/YY)";
        }
        
        if (!cvv.trim()) {
            return "CVV is required";
        } else if (!/^\d{3,4}$/.test(cvv)) {
            return "Invalid CVV";
        }
        
        if (!cardName.trim()) {
            return "Cardholder name is required";
        }
        
        return ""; // Empty string means validation passed
    };
    
    const handleBooking = () => {
        if (!validateForm()) {
            return;
        }
        
        // Show payment modal when form is valid
        setShowPaymentModal(true);
    };
    

    const handlePayment = async () => {
        const validationError = validatePayment();
        if (validationError) {
            setPaymentError(validationError);
            return;
        }
    
        setIsProcessingPayment(true);
        setPaymentError('');
    
        // Simulate payment processing
        setTimeout(async () => {
            try {
                // Process payment (simulated)
                setPaymentSuccess(true);
    
                // Prepare booking data
                const bookingData = {
                    name,
                    from_email: fromEmail,
                    to_email: toEmail,  // Send confirmation email to receiver
                    start_country: startCountry,
                    start_port: startPort,
                    end_country: endCountry,
                    end_port: endPort,
                    delivery_date: deliveryDate,
                    shipping_invoice: shippingInvoice,
                    invoice_type: invoiceType,
                    product_name: productName,
                    product_category: productCategory,
                    weight: parseFloat(weight),
                    base_cost: cost,
                    base_tax: baseTax,
                    country_tax: countryTax,
                    total_tax: totalTax,
                    cost: totalCost,
                    payment_method: "Credit Card",
                    payment_status: "Paid"
                };
    
                // Send booking data to API
                const response = await fetch('https://api-floi.onrender.com/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData)
                });
    
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
    
                const result = await response.json();
    
                // Ensure bookingId exists
                if (!result.bookingId) {
                    throw new Error("Booking ID missing in response");
                }
    
                setEmailSent(true);
    
                // Close modal after short delay
                setTimeout(() => {
                    setShowPaymentModal(false);
                    setBookingSuccess(true);
                }, 1000);
    
            } catch (error) {
                console.error('Booking or payment error:', error);
                setPaymentError(error.message || 'Payment or booking failed. Please try again.');
                setPaymentSuccess(false);
            } finally {
                setIsProcessingPayment(false);
            }
        }, 3000); // Simulate 3 second payment processing
    };

    const resetForm = () => {
        setName('');
        setFromEmail('');
        setToEmail('');
        setStartCountry('');
        setStartPort('');
        setEndCountry('');
        setEndPort('');
        setDeliveryDate('');
        setShippingInvoice("");
        setInvoiceType('');
        setProductName('');
        setProductCategory('');
        setWeight('');
        setBookingSuccess(false);
        setFormErrors({});
        setEmailSent(false);
        
        // Reset payment form
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setCardName('');
        setPaymentSuccess(false);
    };
    
    // Format credit card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        
        for (let i = 0; i < match.length; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };
    
    // Format expiry date
    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        
        if (v.length >= 2) {
            return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
        }
        
        return v;
    };

    return (
        <div className="shipping-booking-container">
            <div className="header">
                <div className="logo">
                    <img src="src\assets\BLACK_LOGO-removebg-preview.png" alt="Global Shipping Solutions" />
                    <span>Surya Shipping Solutions</span>
                </div>
            </div>
            
            <h1>International Shipping Booking</h1>
            
            {bookingSuccess && (
                <div className="success-message" role="alert">
                    <svg viewBox="0 0 24 24" className="check-icon" aria-hidden="true">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                    </svg>
                    <p>Booking successfully created!</p>
                    {emailSent && <p className="email-sent">A confirmation email has been sent to your email address.</p>}
                    <button onClick={resetForm} className="new-booking-button">New Booking</button>
                </div>
            )}
            
            {!bookingSuccess && (
                <>
                    <div className="form-section">
                        <h2>Contact Information</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Name <span className="required">*</span></label>
                                <input 
                                    id="name"
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter full name" 
                                    aria-required="true"
                                    aria-invalid={!!formErrors.name}
                                    aria-describedby={formErrors.name ? "name-error" : undefined}
                                />
                                {formErrors.name && <p id="name-error" className="error-message">{formErrors.name}</p>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="fromEmail">Sender Email <span className="required">*</span></label>
                                <input 
                                    id="fromEmail"
                                    type="email" 
                                    value={fromEmail} 
                                    onChange={(e) => setFromEmail(e.target.value)}
                                    placeholder="sender@example.com" 
                                    aria-required="true"
                                    aria-invalid={!!formErrors.fromEmail}
                                    aria-describedby={formErrors.fromEmail ? "from-email-error" : undefined}
                                />
                                {formErrors.fromEmail && <p id="from-email-error" className="error-message">{formErrors.fromEmail}</p>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="toEmail">Recipient Email <span className="required">*</span></label>
                                <input 
                                    id="toEmail"
                                    type="email" 
                                    value={toEmail} 
                                    onChange={(e) => setToEmail(e.target.value)}
                                    placeholder="recipient@example.com" 
                                    aria-required="true"
                                    aria-invalid={!!formErrors.toEmail}
                                    aria-describedby={formErrors.toEmail ? "to-email-error" : undefined}
                                />
                                {formErrors.toEmail && <p id="to-email-error" className="error-message">{formErrors.toEmail}</p>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h2>Product Information</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="productName">Product Name <span className="required">*</span></label>
                                <input 
                                    id="productName"
                                    type="text" 
                                    value={productName} 
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Enter product name" 
                                    aria-required="true"
                                    aria-invalid={!!formErrors.productName}
                                    aria-describedby={formErrors.productName ? "product-name-error" : undefined}
                                />
                                {formErrors.productName && <p id="product-name-error" className="error-message">{formErrors.productName}</p>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="productCategory">Product Category <span className="required">*</span></label>
                                <select 
                                    id="productCategory"
                                    value={productCategory} 
                                    onChange={(e) => setProductCategory(e.target.value)}
                                    aria-required="true"
                                    aria-invalid={!!formErrors.productCategory}
                                    aria-describedby={formErrors.productCategory ? "product-category-error" : undefined}
                                >
                                    <option value="">Select Category</option>
                                    {productCategories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                {formErrors.productCategory && <p id="product-category-error" className="error-message">{formErrors.productCategory}</p>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="weight">Weight (kg) <span className="required">*</span></label>
                                <input 
                                    id="weight"
                                    type="number" 
                                    min="0.1"
                                    step="0.1"
                                    value={weight} 
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="Enter weight in kg" 
                                    aria-required="true"
                                    aria-invalid={!!formErrors.weight}
                                    aria-describedby={formErrors.weight ? "weight-error" : undefined}
                                />
                                {formErrors.weight && <p id="weight-error" className="error-message">{formErrors.weight}</p>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="invoiceType">Invoice Type <span className="required">*</span></label>
                                <select 
                                    id="invoiceType"
                                    value={invoiceType} 
                                    onChange={(e) => setInvoiceType(e.target.value)}
                                    aria-required="true"
                                    aria-invalid={!!formErrors.invoiceType}
                                    aria-describedby={formErrors.invoiceType ? "invoice-type-error" : undefined}
                                >
                                    <option value="">Select Invoice Type</option>
                                    {invoiceTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                                {formErrors.invoiceType && <p id="invoice-type-error" className="error-message">{formErrors.invoiceType}</p>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h2>Transport Details</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="transportMode">Transport Mode <span className="required">*</span></label>
                                <select 
                                    id="transportMode"
                                    value={shippingInvoice} 
                                    onChange={(e) => setShippingInvoice(e.target.value)}
                                    aria-required="true"
                                    aria-invalid={!!formErrors.shippingInvoice}
                                    aria-describedby={formErrors.shippingInvoice ? "transport-mode-error" : undefined}
                                >
                                    <option value="">Select Transport Mode</option>
                                    <option value="Air">Air</option>
                                    <option value="Ship">Ship</option>
                                    <option value="Train">Train</option>
                                </select>
                                {formErrors.shippingInvoice && <p id="transport-mode-error" className="error-message">{formErrors.shippingInvoice}</p>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="deliveryDate">Delivery Date <span className="required">*</span></label>
                                <input 
                                    id="deliveryDate"
                                    type="date" 
                                    value={deliveryDate} 
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    min={minDate}
                                    aria-required="true"
                                    aria-invalid={!!formErrors.deliveryDate}
                                    aria-describedby={formErrors.deliveryDate ? "delivery-date-error" : undefined}
                                />
                                {formErrors.deliveryDate && <p id="delivery-date-error" className="error-message">{formErrors.deliveryDate}</p>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h2>Route Information</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="startCountry">Origin Country <span className="required">*</span></label>
                                <select 
                                    id="startCountry"
                                    value={startCountry} 
                                    onChange={(e) => {
                                        setStartCountry(e.target.value);
                                        setStartPort(''); // Reset port when country changes
                                    }}
                                    aria-required="true"
                                    aria-invalid={!!formErrors.startCountry}
                                    aria-describedby={formErrors.startCountry ? "start-country-error" : undefined}
                                >
                                    <option value="">Select Country</option>
                                    {Object.keys(portsData).map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                {formErrors.startCountry && <p id="start-country-error" className="error-message">{formErrors.startCountry}</p>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="startPort">Origin Port <span className="required">*</span></label>
                                <select 
                                    id="startPort"
                                    value={startPort} 
                                    onChange={(e) => setStartPort(e.target.value)}
                                    disabled={!startAvailablePorts.length}
                                    aria-required="true"
                                    aria-invalid={!!formErrors.startPort}
                                    aria-describedby={formErrors.startPort ? "start-port-error" : undefined}
                                >
                                    <option value="">Select Port</option>
                                    {startAvailablePorts.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                {formErrors.startPort && <p id="start-port-error" className="error-message">{formErrors.startPort}</p>}
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="endCountry">Destination Country <span className="required">*</span></label>
                                <select 
                                    id="endCountry"
                                    value={endCountry} 
                                    onChange={(e) => {
                                        setEndCountry(e.target.value);
                                        setEndPort(''); // Reset port when country changes
                                    }}
                                    aria-required="true"
                                    aria-invalid={!!formErrors.endCountry}
                                    aria-describedby={formErrors.endCountry ? "end-country-error" : undefined}
                                >
                                    <option value="">Select Country</option>
                                    {Object.keys(portsData).map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                {formErrors.endCountry && <p id="end-country-error" className="error-message">{formErrors.endCountry}</p>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="endPort">Destination Port <span className="required">*</span></label>
                                <select 
                                    id="endPort"
                                    value={endPort} 
                                    onChange={(e) => setEndPort(e.target.value)}
                                    disabled={!endAvailablePorts.length}
                                    aria-required="true"
                                    aria-invalid={!!formErrors.endPort}
                                    aria-describedby={formErrors.endPort ? "end-port-error" : undefined}
                                >
                                    <option value="">Select Port</option>
                                    {endAvailablePorts.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                {formErrors.endPort && <p id="end-port-error" className="error-message">{formErrors.endPort}</p>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="cost-summary">
                        <h2>Cost Summary</h2>
                        <div className="cost-details">
                            <div className="cost-item">
                                <span>Base Cost:</span>
                                <span>${cost.toFixed(2)}</span>
                            </div>
                            <div className="cost-item">
                                <span>Base Tax ({baseTaxRate}%):</span>
                                <span>${baseTax.toFixed(2)}</span>
                            </div>
                            <div className="cost-item">
                                <span>Country Tax ({endCountry ? countryTaxRates[endCountry] : 0}%):</span>
                                <span>${countryTax.toFixed(2)}</span>
                            </div>
                            <div className="cost-item total">
                                <span>Total Cost:</span>
                                <span>${totalCost.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="actions">
                        <button 
                            onClick={handleBooking} 
                            className="book-button"
                            disabled={isLoading}
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </>
            )}
            
            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="payment-modal-overlay">
                    <div className="payment-modal">
                        <div className="payment-modal-header">
                            <h2>Payment Information</h2>
                            {!isProcessingPayment && !paymentSuccess && (
                                <button 
                                    className="close-modal" 
                                    onClick={() => setShowPaymentModal(false)}
                                    aria-label="Close payment modal"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                        
                        {paymentSuccess ? (
                            <div className="payment-success">
                                <svg viewBox="0 0 24 24" className="payment-success-icon" aria-hidden="true">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                                </svg>
                                <p>Payment Successful!</p>
                                <p>Processing your booking...</p>
                            </div>
                        ) : isProcessingPayment ? (
                            <div className="payment-processing">
                                <div className="payment-spinner"></div>
                                <p>Processing Payment...</p>
                                <p className="processing-info">Please do not close this window.</p>
                            </div>
                        ) : (
                            <div className="payment-form">
                                <div className="payment-amount">
                                    <h3>Amount to Pay</h3>
                                    <p className="payment-total">${totalCost.toFixed(2)}</p>
                                </div>
                                
                                {paymentError && (
                                    <div className="payment-error" role="alert">
                                        {paymentError}
                                    </div>
                                )}
                                
                                <div className="payment-group">
                                    <label htmlFor="cardName">Cardholder Name</label>
                                    <input 
                                        id="cardName"
                                        type="text" 
                                        value={cardName} 
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder="Enter cardholder name"
                                    />
                                </div>
                                
                                <div className="payment-group">
                                    <label htmlFor="cardNumber">Card Number</label>
                                    <input 
                                        id="cardNumber"
                                        type="text" 
                                        value={cardNumber} 
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                    />
                                </div>
                                
                                <div className="payment-row">
                                    <div className="payment-group half">
                                        <label htmlFor="expiryDate">Expiry Date</label>
                                        <input 
                                            id="expiryDate"
                                            type="text" 
                                            value={expiryDate} 
                                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                            placeholder="MM/YY"
                                            maxLength="5"
                                        />
                                    </div>
                                    
                                    <div className="payment-group half">
                                        <label htmlFor="cvv">CVV</label>
                                        <input 
                                            id="cvv"
                                            type="text" 
                                            value={cvv} 
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                            placeholder="123"
                                            maxLength="4"
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    className="payment-button" 
                                    onClick={handlePayment}
                                >
                                    Pay ${totalCost.toFixed(2)}
                                </button>
                                
                                <div className="payment-security">
                                    <svg viewBox="0 0 24 24" className="lock-icon" aria-hidden="true">
                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path>
                                    </svg>
                                    <span>Secure Payment</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingComponent;