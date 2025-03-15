import React, { Component, createRef } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";


// Nav component assets
// import logo from "../assets/WHITE_LOGO-removebg-preview.png";
import logo from "../assets/Company_logo.png";
import profileImg from "../assets/profilelogo.png";
import userImg from "../assets/profile_pic.png"

// Body component assets
import agriculture from "../assets/Agriculture.png";
import fruits from "../assets/Fruits.png";
import pharma from "../assets/pharma.png";
import carParts from "../assets/car_parts.png";
import granite from "../assets/Granite_stones.png";
import plastics from "../assets/plastics.png";
import food from "../assets/tablefood.png";
import wood from "../assets/stackedwood.png";
import furniture from "../assets/tables.png";

// Import styles
import "./NavStyle.css";
import "./BodyStyle.css";
import "./Skeleton.css";

// Default static data that will remain as requested
const DEFAULT_CARD_DATA = [
    { id: 1, date: "19/02/2025", title: "EU Price Announcement - Trade from India & Pakistan to Europe", description: "EU Price Announcements, India, Pakistan, Europe" },
    { id: 2, date: "17/02/2025", title: "Price Announcement - Trade from Asia to Mediterranean (inc. West Med, East Med, Adriatic and...)", description: "Asia, East West Network" },
    { id: 3, date: "13/02/2025", title: "EU Price Announcement - Trade from India & Pakistan to Europe", description: "India, Pakistan, Europe" },
    { id: 4, date: "10/02/2025", title: "Trade Tariff Adjustment for South America Region", description: "South America, Brazil, Argentina" },
    { id: 5, date: "05/02/2025", title: "New Freight Rates for Middle East & Africa Routes", description: "Middle East, Africa, Global Trade" },
    { id: 6, date: "01/02/2025", title: "Cargo Price Update for North America", description: "North America, Canada, USA, Mexico" },
    { id: 7, date: "28/01/2025", title: "Shipping Rate Increase on Australia Routes", description: "Australia, Oceania, Global Markets" },
    { id: 8, date: "25/01/2025", title: "New Fuel Surcharge for Asia-Pacific Shipments", description: "Asia-Pacific, Logistics, Fuel" },
    { id: 9, date: "22/01/2025", title: "Rate Adjustment for European Shipping Lanes", description: "Europe, Shipping, Freight" },
    { id: 10, date: "20/01/2025", title: "Important Update: Trade Policy Changes for African Routes", description: "Africa, Trade Regulations, Import & Export" }
];

const DEFAULT_SLIDES = [
    [
        { img: agriculture, title: "Agriculture", description: "Organic crops & produce" },
        { img: fruits, title: "Fruits", description: "Fresh farm-sourced fruits" },
        { img: pharma, title: "Pharma", description: "Medicines & healthcare" },
    ],
    [
        { img: carParts, title: "Car Parts", description: "Automotive parts & accessories" },
        { img: granite, title: "Granite", description: "Elegant & durable stones" },
        { img: plastics, title: "Plastics", description: "Industrial-grade materials" },
    ],
    [
        { img: food, title: "Food", description: "Fresh & organic food items" },
        { img: wood, title: "Wood", description: "Timber & wooden products" },
        { img: furniture, title: "Furniture", description: "Modern & stylish designs" }
    ],
];

// Solution categories data
const SOLUTION_CATEGORIES = [
    {
        name: "Shipping Solution",
        logo: "src/assets/Ship_logo.png",
        bgImage: "../../src/assets/ship.jpg"
    },
    {
        name: "Inland Transportation & Logistics Solutions",
        logo: "src/assets/Inland_logo.png",
        bgImage: "../../src/assets/Track.png"
    },
    {
        name: "Air Cargo Solution",
        logo: "src/assets/Air_cargo.png",
        bgImage: "../../src/assets/Air.png"
    },
    {
        name: "Digital Business Solutions",
        logo: "src/assets/Digital_cargo.png",
        bgImage: "../../src/assets/digital.jpg"
    },
    {
        name: "Cargo Cover Solutions",
        logo: "src/assets/cargo_bg.png",
        bgImage: "src/assets/cargo.png"
    }
];

// API configuration
const API_CONFIG = {
    baseUrl: 'https://api-floi.onrender.com/api/booking/',
    endpoints: {
        booking: 'bookings/'  // Removed extra slash to ensure correct URL formation
    }
};

const itemsPerPage = 3;

class Landing extends Component {
    constructor() {
        super();
        this.state = {
            bookingId: "",
            bookingData: null,
            showPopup: false,
            error: null,
            dropdownOpen: false,
            isLoggedIn: false,
            user: null,
            showModal: false,
            backgroundImage: "../../src/assets/ship.jpg",
            currentPage: 1,
            cardData: DEFAULT_CARD_DATA,
            slides: DEFAULT_SLIDES,
            isLoading: false,
            customAlert: {
                show: false,
                message: ''
            },
            solutionCategories: SOLUTION_CATEGORIES
        };
        this.dropdownRef = createRef();
        this.searchInputRef = createRef();
        this.bookingButtonRef = createRef();
    }

    // ----------------- API-related methods -----------------
    fetchBookingData = async (bookingId) => {
        try {
            const apiUrl = `https://api-floi.onrender.com/api/booking/bookings/${bookingId}`;
            // console.log(`Attempting to fetch: ${apiUrl}`);

            const response = await axios.get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // console.log('API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ API Error:', error);
            return null;
        }
    };



    // ----------------- Nav component methods -----------------
    handleChange = (e) => {
        this.setState({ bookingId: e.target.value });
    };

    handleClick = async (event) => {
        event.preventDefault();

        if (!this.state.isLoggedIn) {
            this.setState({
                showModal: true,
                error: null
            });
            this.setState({ bookingId: "" })
            return;
        }

        if (!this.state.bookingId.trim()) {
            this.setState({ error: 'Please enter a Booking ID' });
            this.setState({ bookingId: "" })
            return;
        }

        this.setState({ isLoading: true, error: null });

        try {
            const bookingData = await this.fetchBookingData(this.state.bookingId);

            if (bookingData) {
                this.setState({
                    bookingData,
                    showPopup: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    error: 'No booking found with this ID.',
                    isLoading: false
                });
            }
        } catch (error) {
            this.setState({
                error: error.response?.data?.message || 'Error fetching booking. Please try again.',
                isLoading: false
            });
        }
    };

    closePopup = () => {
        this.setState({ showPopup: false });
        this.setState({ bookingId: "" })
    };

    toggleDropdown = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }));
    };

    closeDropdown = (event) => {
        if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
            this.setState({ dropdownOpen: false });
        }
    };

    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.setState({
            isLoggedIn: false,
            user: null,
            dropdownOpen: false
        });
        this.showAlert("Logged out successfully");
    };

    // ----------------- Body component methods -----------------
    handleMouseEnter = (image) => {
        this.setState({ backgroundImage: image });
    };

    handleMouseLeave = () => {
        this.setState({ backgroundImage: "../../src/assets/ship.jpg" });
    };

    getTotalPages = () => {
        return Math.ceil(this.state.cardData.length / itemsPerPage);
    };

    showAlert = (message) => {
        this.setState({
            customAlert: {
                show: true,
                message
            }
        });

        setTimeout(() => {
            this.setState({
                customAlert: {
                    show: false,
                    message: ''
                }
            });
        }, 3000);
    };

    handleBookingClick = () => {
        if (!this.state.isLoggedIn) {
            this.showAlert("Please login to start your bookings.");
        }
    };

    getCurrentCards = () => {
        const { currentPage, cardData } = this.state;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return cardData.slice(indexOfFirstItem, indexOfLastItem);
    };

    nextPage = () => {
        this.setState((prevState) => ({
            currentPage: Math.min(prevState.currentPage + 1, this.getTotalPages())
        }));
    };

    prevPage = () => {
        this.setState((prevState) => ({
            currentPage: Math.max(prevState.currentPage - 1, 1)
        }));
    };

    focusSearchInput = () => {
        if (this.searchInputRef.current) {
            this.searchInputRef.current.focus();
        }
    };

    scrollToBookings = () => {
        if (this.bookingButtonRef.current) {
            this.bookingButtonRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    };

    // ----------------- Bootstrap Carousel initialization -----------------
    initializeCarousels = () => {
        if (typeof window !== 'undefined') {
            import('bootstrap/dist/js/bootstrap.bundle.min.js')
                .then(() => {
                    if (window.bootstrap) {
                        const carouselElement = document.querySelector('#carouselExample');
                        if (carouselElement) {
                            new window.bootstrap.Carousel(carouselElement, {
                                interval: 3000,
                                ride: 'carousel'
                            });
                            // console.log('Carousel initialized:', carouselElement);
                        } else {
                            console.warn('Carousel element not found: #carouselExample');
                        }

                        const carouselDarkElement = document.querySelector('#carouselExampleDark');
                        if (carouselDarkElement) {
                            new window.bootstrap.Carousel(carouselDarkElement, {
                                interval: 10000,
                                ride: 'carousel'
                            });
                            // console.log('Dark carousel initialized:', carouselDarkElement);
                        } else {
                            console.warn('Carousel element not found: #carouselExampleDark');
                        }
                    } else {
                        console.error('Bootstrap not available on window object');
                    }
                })
                .catch(err => console.error('Failed to load Bootstrap:', err));
        }
    };

    // ----------------- Firebase Auth Listener (assuming you're using Firebase) -----------------
    setupAuthListener = () => {
        const auth = getAuth();

        // Firebase auth state listener
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                this.setState({
                    isLoggedIn: true,
                    user: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    }
                });
                // console.log("User is logged in:", user);
            } else {
                // User is signed out
                this.setState({
                    isLoggedIn: false,
                    user: null
                });
                console.log("No user logged in");
            }
        });
    };

    // ----------------- Lifecycle methods -----------------
    componentDidMount() {
        // Add click listener to close dropdown when clicking outside
        document.addEventListener("mousedown", this.closeDropdown);

        // Setup auth listener (for Firebase or your auth system)
        this.setupAuthListener();

        // Initialize Bootstrap carousels
        this.initializeCarousels();

        // Focus on search input for better UX
        setTimeout(() => {
            this.focusSearchInput();
        }, 1000);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.closeDropdown);
    }

    // ----------------- Render methods -----------------
    renderPopupContent() {
        const { bookingData } = this.state;

        if (!bookingData) return null;

        return (
            <div className="popup-content">
                <h2>Booking Details</h2>
                <div className="booking-info">
                    <p><strong>Booking ID:</strong> {bookingData._id}</p>
                    {Object.entries(bookingData)
                        .filter(([key]) => key !== '_id' && typeof bookingData[key] !== 'function')
                        .map(([key, value]) => (
                            <p key={key}>
                                <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {
                                    typeof value === 'object'
                                        ? JSON.stringify(value)
                                        : value
                                }
                            </p>
                        ))
                    }
                </div>
                <button className="btn btn-primary" onClick={this.closePopup}>OK</button>
            </div>
        );
    }

    renderSolutionCategories() {
        return this.state.solutionCategories.map((category, index) => (
            <div
                key={index}
                className="BodyContainer2Child"
                onMouseEnter={() => this.handleMouseEnter(category.bgImage)}
                onMouseLeave={this.handleMouseLeave}
            >
                <img src={category.logo} width={200} alt={category.name} />
                <h2>{category.name}</h2>
            </div>
        ));
    }

    render() {
        const { currentPage, bookingId, showPopup, error, isLoading, isLoggedIn, dropdownOpen } = this.state;
        const totalPages = this.getTotalPages();
        const currentCards = this.getCurrentCards();

        return (
            <>
                {/* Custom Alert */}
                {this.state.customAlert?.show && (
                    <div className="custom-alert">
                        <div className="alert-content">
                            <p>{this.state.customAlert.message}</p>
                        </div>
                    </div>
                )}

                {/* Nav Section */}
                <header>
                    <div className="NavContainer1">
                        <div className="navbar">
                            <div className="flex">
                                <img src={logo} alt="Logo" width={100} />
                            </div>
                            <div className="flex-2">
                                <div className="dropdown" ref={this.dropdownRef}>
                                    <button type="button" onClick={this.toggleDropdown} className="profile-button">
                                        <img
                                            alt="Profile"
                                            src={this.state.isLoggedIn ? userImg : profileImg}
                                            className="profile-img"
                                        />
                                    </button>
                                    <div className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}>
                                        <ul>
                                            {isLoggedIn ? (
                                                <>
                                                    <li>
                                                        <Link to="/profilepage">Profile</Link>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="logout-btn" onClick={this.handleLogout}>
                                                            Logout
                                                        </button>
                                                    </li>
                                                </>
                                            ) : (
                                                <li>
                                                    <Link className="login-btn" to="/Login&Registration">
                                                        Login & Registration
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="NavContainerChild2">
                            <p>LEADER IN</p>
                            <span>GLOBAL & LOGISTICS</span>
                        </div>
                    </div>
                    <div className="transport-search-container">
                        <div className="NavContainer2">
                            <form onSubmit={this.handleClick}>
                                <input
                                    className="input1"
                                    type="text"
                                    placeholder="Enter your Booking ID"
                                    value={bookingId}
                                    onChange={this.handleChange}
                                    ref={this.searchInputRef}
                                />
                                <button className="button1" type="submit" disabled={isLoading}>
                                    {isLoading ? 'Searching...' : 'Search...'}
                                </button>
                            </form>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        {showPopup && (
                            <div className="popup-overlay">
                                <div className="popup">
                                    {this.renderPopupContent()}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Login Modal */}
                    {this.state.showModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <div>
                                    <h2>Authentication Required</h2>
                                    <p>Please log in to proceed with your search.</p>
                                    <div className="modal-buttons">
                                        <button onClick={this.handleCloseModal} className="close-btn">Close</button>
                                        <Link to="/Login&Riegistration" className="login-link">Login</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                {/* Body Section */}
                <main>
                    <div className="BodyContainer1">
                        <h1>Our Solutions</h1>
                        <div className="BodyContainer1Child1"></div>
                        <div className="BodyContainer1Child2">
                            <p>As well as being a global leader in container shipping, our worldwide teams of industry specific experts mean we can offer our customers round-the-clock personalised service. This ensures we deliver fast and reliable transit times, and that we provide the best solutions for your needs.</p>
                        </div>
                    </div>

                    {/* Solutions Section with Dynamic Data */}
                    <div className="BodyContainer2" style={{ backgroundImage: `url(${this.state.backgroundImage})` }}>
                        {this.renderSolutionCategories()}
                    </div>

                    <div className="BodyContainer3">
                        {isLoggedIn ? (
                            <Link to="/Transport">
                                <button className="links" ref={this.bookingButtonRef}>Start Your Bookings</button>
                            </Link>
                        ) : (
                            <button
                                className="links"
                                onClick={this.handleBookingClick}
                                ref={this.bookingButtonRef}
                            >
                                Start Your Bookings
                            </button>
                        )}
                    </div>

                    {/* Carousel Section with Static Data as requested */}
                    <div className="BodyContainer4">
                        <div id="carouselExampleDark" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item active" data-bs-interval="10000">
                                    <div className="card lg:card-side bg-base-100 shadow-xl">
                                        <figure>
                                            <img src="src/assets/ShipContainer.png" alt="Album" />
                                        </figure>
                                        <div className="card-body">
                                            <h2 className="card-title">Seamless Global Shipping</h2>
                                            <p>Experience unmatched reliability with SGL's Standalone Network, offering extensive coverage, tailored solutions, and efficient transit times for your cargo.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item" data-bs-interval="10000">
                                    <div className="card lg:card-side bg-base-100 shadow-xl">
                                        <figure>
                                            <img src="src\assets\OceanShip.jpg" alt="Album" />
                                        </figure>
                                        <div className="card-body">
                                            <h2 className="card-title">Trusted Ocean Freight Solutions</h2>
                                            <p>Navigate global trade with confidence. Our expert logistics and vast shipping network ensure smooth and secure cargo transportation across the world.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Carousel Controls */}
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">◄</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">►</span>
                            </button>
                        </div>
                    </div>


                    <div className="BodyContainer5">
                        <h1>Your Shipping Needs Met</h1>
                        <div className="BodyContainer5Child1"></div>
                        <div className="BodyContainer5Child2">
                            <p>At SGL we pride ourselves on being a global container shipping company that delivers tailored solutions designed to meet the specific needs of each of our customers. Regardless of your cargo type, or final destination, we offer versatile solutions that cover air, land, and sea.</p>
                        </div>
                        <div className="BodyContainer5Child3">
                            <p>Thanks to the extensive capacity of our container fleet, SGL is the trusted transportation partner and shipping company for numerous companies the world over. Combining this with our global port coverage and extensive equipment availability means, we are able to deliver a professional, efficient shipping service, tailored to the specific needs of your business.</p>
                        </div>
                    </div>

                    {/* Product Slides with Static Data as requested */}
                    <div className="BodyContainer6">
                        <div className="container my-5 text-center">
                            <div className="position-relative">
                                <div id="carouselExample" className="carousel slide carousel-fade" data-bs-ride="carousel">
                                    <div className="carousel-inner">
                                        {this.state.slides.map((group, index) => (
                                            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                                <div className="container">
                                                    <div className="row justify-content-center g-4">
                                                        {group.map((item, idx) => (
                                                            <div key={idx} className="col-md-4">
                                                                <div className="card shadow-lg border-0 rounded-lg">
                                                                    <figure className="p-4">
                                                                        <img src={item.img} alt={item.title} width={300} className="rounded img-fluid" />
                                                                    </figure>
                                                                    <div className="card-body text-center">
                                                                        <h5 className="card-title fw-bold">{item.title}</h5>
                                                                        <p className="text-muted">{item.description}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center gap-3 mt-3">
                                    <button className="btn px-4" data-bs-target="#carouselExample" data-bs-slide="prev"> ◄ </button>
                                    <button className="btn px-4" data-bs-target="#carouselExample" data-bs-slide="next"> ► </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="BodyContainer7">
                        <h1>Moving the World</h1>
                        <div className="BodyContainer7Child2">
                            <p>With a commitment to sustainability and innovation, SGL is dedicated to moving the world forward. Our comprehensive logistics solutions are designed to meet the evolving needs of our customers, ensuring seamless and efficient transportation across the globe.</p>
                        </div>
                    </div>
                    <div className="BodyContainer8">
                        <h1>Customer Advisories</h1>
                        <div className="BodyContainer8Child1"></div>
                        <div className="BodyContainer8Child2">
                            <div className="flex flex-col items-center">
                                {/* Card Display - Static as requested */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {currentCards.map((card) => (
                                        <div key={card.id} className="card bg-base-100 w-70 shadow-xl">
                                            <div className="card-body">
                                                <h3 className="card-title">{card.date}</h3>
                                                <h5>{card.title}</h5>
                                                <p>{card.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                <div className="join mt-4">
                                    <button onClick={this.prevPage} disabled={currentPage === 1} className="join-item btn">
                                        «
                                    </button>
                                    <button className="join-item btn"> {currentPage}</button>
                                    <button onClick={this.nextPage} disabled={currentPage === totalPages} className="join-item btn">
                                        »
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer Section */}
                <footer className="bg-gray-100 py-8 px-4 text-gray-700">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Contact Section */}
                        <div>
                            <h3 className="font-bold uppercase mb-3">Country-Location / Local Office</h3>
                            <p>IN - SGL Mumbai</p>
                            <p className="flex items-center mt-2">📞 +91 2266378000</p>
                            <p className="flex items-center">✉️ ind-info@sgl.com</p>
                            <p className="mt-2">🏢 Office details</p>
                        </div>

                        {/* Business Section */}
                        <div>
                            <h3 className="font-bold uppercase mb-3">Doing Business Together</h3>
                            <p>Solutions / Local Information / E-Business</p>
                            <p>Sustainability / mySGL</p>
                        </div>

                        {/* About Section */}
                        <div>
                            <h3 className="font-bold uppercase mb-3">Get to Know Us</h3>
                            <p>SGL Group / Newsroom / Events / Blog / Careers</p>
                            <p>Contact us / Preference Center</p>
                            <div className="flex space-x-4 mt-4 text-xl">
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                    <FaFacebook className="text-blue-600 text-2xl hover:text-blue-800" />
                                </a>
                                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                                    <FaTwitter className="text-blue-400 text-2xl hover:text-blue-600" />
                                </a>
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                    <FaInstagram className="text-pink-500 text-2xl hover:text-pink-700" />
                                </a>
                                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                                    <FaLinkedin className="text-blue-700 text-2xl hover:text-blue-900" />
                                </a>
                                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                                    <FaYoutube className="text-red-600 text-2xl hover:text-red-800" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="text-center mt-6 text-sm text-gray-500">
                        <p>Headquarters: +41 227038888 - info@sgl.com</p>
                        <p>Chemin Rieu 12, 1208 Geneva - Switzerland</p>
                    </div>

                    {/* Legal Links */}
                    <div className="text-center mt-4 text-xs text-gray-400">
                        <p>Cookie Settings - Data Privacy - Personal Data Request - Terms of Use - Carrier's Terms & Conditions - EU Commitments - Code of Conduct - Certifications - Speak Up Line</p>
                    </div>
                </footer>
            </>
        );
    }
}

export default Landing;