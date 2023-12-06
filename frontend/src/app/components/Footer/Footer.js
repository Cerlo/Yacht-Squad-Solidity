// src/app/components/Footer/Footer.js

import React from 'react';
import { FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-lessDark text-white">
            {/* Top Section with Links and Social Icons */}
            <div className="flex flex-col items-center justify-center p-4 bg-dark">
                <div className="mb-2">
                    <img src="/csv-logo.svg" alt="CSV Logo" className="h-12 mr-2" />
                </div>


                <a href="mailto:contact@yachtsquad.com" className="mb-2 text-white hover:text-gold">Contact Us</a>
                <div className="flex space-x-2">
                    <a href="https://www.linkedin.com" className="text-white hover:text-gold">
                        <FaLinkedin size="24" />
                    </a>
                    <a href="https://github.com/Cerlo/Yacht-Squad-Solidity" className="text-white hover:text-gold">
                        <FaGithub size="24" />
                    </a>
                    <a href="https://www.discord.com" className="text-white hover:text-gold">
                        <FaDiscord size="24" />
                    </a>
                </div>
            </div>

            {/* Bottom Section with Copyright */}
            <div className="p-2 text-center shadow-[0px_-8px_30px_-5px_#fcd462]"> {/* Adjust shadow color as needed */}
                <p>© 2023 YachtSquad Inc. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
