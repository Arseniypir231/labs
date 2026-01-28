import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };

    return (
        <section className="contact-page">
            <div className="contact-container">
                <h1 className="page-title">Contact Us</h1>
                <div className="contact-content">
                    <div className="contact-info">
                        <h2>Get in Touch</h2>
                        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                        <div className="contact-details">
                            <div className="contact-item">
                                <h3>Email</h3>
                                <p>info@logwork.com</p>
                            </div>
                            <div className="contact-item">
                                <h3>Phone</h3>
                                <p>+1 (555) 123-4567</p>
                            </div>
                            <div className="contact-item">
                                <h3>Address</h3>
                                <p>123 Fashion Street<br />New York, NY 10001</p>
                            </div>
                        </div>
                    </div>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="6"
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Send Message</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
