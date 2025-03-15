import React, { Component, createRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/LogoWhite.png";
import profileImg from "../assets/profilelogo.avif";
import "./NavStyle.css";

class Nav extends Component {
    constructor() {
        super();
        this.state = {
            inputValue: "",
            displayedValue: "",
            dropdownOpen: false,
            isLoggedIn: false,
            user: null,
            showModal: false,
        };
        this.dropdownRef = createRef();
    }

    handleChange = (e) => {
        this.setState({ inputValue: e.target.value });
    };

    handleClick = (e) => {
        e.preventDefault();
        if (!this.state.isLoggedIn) {
            this.setState({ showModal: true });
    
            // Automatically close modal after 3 seconds
            setTimeout(() => {
                this.setState({ showModal: false });
            }, 3000);
    
            return;
        }
        this.setState({ displayedValue: this.state.inputValue });
        console.log("Search query:", this.state.inputValue);
    };
    

    toggleDropdown = () => {
        this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }));
    };

    closeDropdown = (event) => {
        if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
            this.setState({ dropdownOpen: false });
        }
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.closeDropdown);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.closeDropdown);
    }

    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    render() {
        return (
            <header>
                <div className="NavContainer1">
                    <div className="navbar">
                        <div className="flex">
                            <img src={logo} alt="Logo" width={100} />
                        </div>
                        <div className="flex-2">
                            <div className="dropdown" ref={this.dropdownRef}>
                                <button type="button" onClick={this.toggleDropdown} className="focus:outline-none">
                                    <img alt="Profile" src={profileImg} className="profile-img" />
                                </button>
                                <div className={`dropdown-menu ${this.state.dropdownOpen ? "active" : ""}`}>
                                    <ul>
                                        {this.state.isLoggedIn ? (
                                            <>
                                                <li>
                                                    <Link to="/profile">Profile</Link>
                                                </li>
                                                <li>
                                                    <button type="button" className="logout-btn">
                                                        Logout
                                                    </button>
                                                </li>
                                            </>
                                        ) : (
                                            <li>
                                                <Link className="login-btn" to="/Login&Riegistration">
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
                        <span>SHIPPING & LOGISTICS</span>
                    </div>
                </div>
                <div className="NavContainer2">
                    <form onSubmit={this.handleClick}>
                        <input
                            type="text"
                            placeholder="Enter the Transport ID!"
                            value={this.state.inputValue}
                            onChange={this.handleChange}
                        />
                        <button type="submit">Search...</button>
                    </form>
                </div>
                {this.state.showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                           <div>
                           <h2>Authentication Required</h2>
                            <p>Please log in to proceed with your search.</p>
                            <button onClick={this.handleCloseModal}>Close</button>
                            <Link to="/Login&Riegistration" className="login-link">Login</Link>
                           </div>
                        </div>
                    </div>
                )}
            </header>
        );
    }
}

export default Nav;
