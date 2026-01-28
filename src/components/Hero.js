import React from 'react';
import './Hero.css';

const Hero = ({ heroData }) => {
    return (
        <section className="hero">
            <article className="heroImage">
                <img src={heroData.image} alt="heroImage" />
            </article>
            <article className="heroText">
                <h3>{heroData.category}</h3>
                <h1>{heroData.title}</h1>
                <article className="h2_container">
                    <h2>{heroData.date}</h2>
                    <h2><span>By</span> {heroData.author}</h2>
                    <h2>{heroData.comments} comments</h2>
                </article>
            </article>
        </section>
    );
};

export default Hero;
