import React from 'react'

import Navbar from '../../Components/Navbar';

import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';


export default function ContactPage() {
    return (
        <div className="bg-white text-[#820000] font-sans mt-[3rem]">
            <Navbar logoHidden={true} />
            <section className="bg-gradient-to-b from-gray-100 to-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-gray-700 mb-12">
                        We’d love to hear from you! Whether you have a question about admissions, programs, or anything else,
                        our team is ready to answer all your questions.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8 text-[#820000]">
                        <div className="flex items-start gap-4">
                            <FaMapMarkerAlt className="text-2xl mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold">Our Address</h3>
                                <p className="text-gray-700">Barangay Calubcub 1.0, San Juan, Batangas, Philippines</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <FaPhoneAlt className="text-2xl mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold">Phone</h3>
                                <p className="text-gray-700">+63 917 123 4567</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <FaEnvelope className="text-2xl mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold">Email</h3>
                                <p className="text-gray-700">calubcub1nhs@email.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form className="bg-white shadow-lg rounded-xl p-8 space-y-6 border border-gray-200">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#820000]/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#820000]/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Message</label>
                            <textarea
                                rows={4}
                                placeholder="Write your message here..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#820000]/50"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-[#820000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6e0000] transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#820000] text-white text-center py-6 mt-20">
                <p className="text-sm">&copy; 2025 Calubcub 1.0 National High School. All rights reserved.</p>
            </footer>
        </div>
    );
}