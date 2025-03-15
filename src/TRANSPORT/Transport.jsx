import React, { Component, createRef } from "react";
import "./Transport.css";
import { Link } from "react-router-dom";
import { auth } from "../FIREBASE/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../assets/Company_logo.png";
import userImg from "../assets/profile_pic.png"

// Import images for carousel and shipping logos
import image1 from "../assets/img1.png";
import image2 from "../assets/img2.png";
import image3 from "../assets/img3.png";
import shipLogo from "../assets/Ship_logo.png";
import inlandLogo from "../assets/Inland_logo.png";
import airLogo from "../assets/Air_cargo.png";
import transportShip from "../assets/TransportShip.png";

// Import social media icons
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
// Import service icons
import { FaShip, FaTruck, FaPlane, FaWarehouse, FaFileContract, FaGlobeAmericas } from "react-icons/fa";

class Transport extends Component {
    constructor() {
        super();
        this.state = {
            isDropdownVisible: false,
            isUserAuthenticated: false,
            currentUser: null,
            currentImageIndex: 0,
        };
        this.dropdownRef = createRef();
        this.carouselImages = [image1, image2, image3];
    }

    toggleUserDropdown = () => {
        this.setState((prevState) => ({ isDropdownVisible: !prevState.isDropdownVisible }));
    };

    closeUserDropdown = (event) => {
        if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
            this.setState({ isDropdownVisible: false });
        }
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.closeUserDropdown);
        onAuthStateChanged(auth, (user) => {
            this.setState({ isUserAuthenticated: !!user, currentUser: user });
        });
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.closeUserDropdown);
    }

    executeLogout = async () => {
        try {
            await signOut(auth);
            this.setState({ isUserAuthenticated: false, currentUser: null, isDropdownVisible: false });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    prevImage = () => {
        this.setState((prevState) => ({
            currentImageIndex: (prevState.currentImageIndex - 1 + this.carouselImages.length) % this.carouselImages.length
        }));
    };

    nextImage = () => {
        this.setState((prevState) => ({
            currentImageIndex: (prevState.currentImageIndex + 1) % this.carouselImages.length
        }));
    };

    render() {
        return (
            <>
                <div className="NavWrapper" style={{ backgroundImage: `url(${transportShip})` }}>
                    <div className="navigationBar">
                        <div className="logoContainer">
                            <img src={logo} alt="Logo" width={80} />
                        </div>
                        <div className="profileSection">
                            <div className="userDropdown" ref={this.dropdownRef}>
                                <button type="button" onClick={this.toggleUserDropdown} className="dropdownToggle">
                                    <img
                                        alt="Profile"
                                        src={userImg}
                                        className="profile-img"
                                    />
                                </button>
                                <div className={`dropdownContent ${this.state.isDropdownVisible ? "visible" : ""}`}>
                                    <ul>
                                        {this.state.isUserAuthenticated ? (
                                            <>
                                                <li><Link to="/profilepage">Profile</Link></li>
                                                <li>
                                                    <Link type="button" onClick={this.executeLogout} className="signOutButton" to="/">Logout</Link>
                                                </li>
                                            </>
                                        ) : (
                                            <li><Link className="signInButton" to="/Login&Registration">Login & Registration</Link></li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="shipping">
                        <div className="shippingChild"><img src={shipLogo} width={200} alt="Ship Logo" /></div>
                        <div className="shippingChild"><img src={inlandLogo} width={200} alt="Inland Logo" /></div>
                        <div className="shippingChild"><img src={airLogo} width={200} alt="Air Logo" /></div>
                    </div>

                    <div className="start-booking-container">
                        <Link to="/Bookings">
                            <button className="start-booking-button">Start Booking</button>
                        </Link>
                    </div>
                </div>

                <div className="carousel-container">
                    <div className="carousel-text">
                        <h2>Providing you a Full Portfolio of Solutions</h2>
                        <p>We share your passion for transporting cargo safely, efficiently and sustainably around the world. As a global leader in container shipping our ships transport all types of goods all over the world, meeting critical deadlines for a huge range of customers. Customers in many different industries rely on us and we deliver, across 300 routes and 900 vessels, with a choice of services that cater for the demands of your cargo.
                            Choose from a range of dry cargo containers in standard and high cube steel, reefer containers using the latest technology to keep your frozen and refrigerated produce at optimum conditions, and solutions for your oversized cargo. We have the expertise to offer you the right solution for your shipments and the personalized support your business needs.
                        </p>
                    </div>

                    <div className="carousel">
                        <button className="carousel-btn left-btn" onClick={this.prevImage}>❮</button>
                        <div className="carousel-image">
                            <img src={this.carouselImages[this.state.currentImageIndex]} alt="Carousel Image" />
                        </div>
                        <button className="carousel-btn right-btn" onClick={this.nextImage}>❯</button>
                    </div>
                </div>

                {/* Services Section with Cards */}
                <div className="services-section">
                    <div className="section-header">
                        <h2>Our Services at SGL - Surya Global Logistics</h2>
                        <p>Comprehensive logistics solutions tailored to your business needs</p>
                    </div>

                    <div className="service-cards">
                        <div className="service-card">
                            <div className="card-icon">
                                <FaShip />
                            </div>
                            <h3>Sea Freight</h3>
                            <p>Global sea freight solutions with full and less than container load options for all your shipping needs.</p>
                        </div>

                        <div className="service-card">
                            <div className="card-icon">
                                <FaTruck />
                            </div>
                            <h3>Road Transport</h3>
                            <p>Reliable inland transportation services with extensive coverage and real-time tracking capabilities.</p>
                        </div>

                        <div className="service-card">
                            <div className="card-icon">
                                <FaPlane />
                            </div>
                            <h3>Air Freight</h3>
                            <p>Fast and efficient air cargo services to meet your urgent delivery requirements worldwide.</p>
                        </div>

                        <div className="service-card">
                            <div className="card-icon">
                                <FaWarehouse />
                            </div>
                            <h3>Warehousing</h3>
                            <p>Strategic warehousing facilities with inventory management and distribution services.</p>
                        </div>

                        <div className="service-card">
                            <div className="card-icon">
                                <FaFileContract />
                            </div>
                            <h3>Customs Clearance</h3>
                            <p>Expert assistance with documentation and compliance for smooth customs procedures.</p>
                        </div>

                        <div className="service-card">
                            <div className="card-icon">
                                <FaGlobeAmericas />
                            </div>
                            <h3>Global Coverage</h3>
                            <p>Extensive network spanning across continents to serve your international shipping requirements.</p>
                        </div>
                    </div>
                </div>

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

export default Transport;