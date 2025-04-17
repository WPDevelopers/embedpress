import { useState, useEffect, useRef } from 'react';
import './scss/TestimonialSlider.scss';

const testimonials = [
    { text: '1 We love EmbedPress! Our designers were using it for their projects, so we already knew what kind of design they want.', author: 'Janny M.', company: 'xyz company', img: 'https://secure.gravatar.com/avatar/6e668512553a7627addadf288f0db8ea5e12591c91eecfecae00adbd6f74e2e6?s=300&d=retro&r=g' },
    { text: '2 We love EmbedPress! Our designers were using it for their projects, so we already knew what kind of design they want.', author: 'Janny M.', company: 'xyz company', img: 'https://secure.gravatar.com/avatar/faf880ef451170c850ccbd615d5eafdbe9132752af86c60e06b26dd768764d26?s=300&d=retro&r=g' },
    { text: '3 We love EmbedPress! Our designers were using it for their projects, so we already knew what kind of design they want.', author: 'Janny M.', company: 'xyz company', img: 'https://secure.gravatar.com/avatar/4c14dcaadc5eaa40d3b30bc9d4889fcd18e8d90c8a17c5cd7698c4681b1a8afa?s=300&d=retro&r=g' },
];

const TestimonialSlider = () => {
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef(null);

    const startSlider = () => {
        intervalRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % testimonials.length);
        }, 3000);
    };

    const resetSlider = () => {
        clearInterval(intervalRef.current);
        startSlider();
    };

    useEffect(() => {
        startSlider();
        return () => clearInterval(intervalRef.current); // cleanup
    }, []);

    const goToSlide = (index) => {
        setCurrent(index);
        resetSlider();
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        resetSlider();
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
        resetSlider();
    };

    return (
        <section className="section epub-testimonial_section">
            <div className="epob-container">
                <div className="epob-testimonial_wrapper">
                    <div className="epob-testimonial epob-slick_slider">
                        {testimonials.map((item, index) => (
                            <div
                                key={index}
                                className={`epob-testimonial_item ${index === current ? 'visible' : 'hidden'}`}
                            >
                                <ul className="epob-review">
                                    {Array(5).fill().map((_, i) => (
                                        <li key={i} className="epob-review_item">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.463 2.756a.6.6 0 0 1 1.076 0l1.898 3.845a.6.6 0 0 0 .451.328l4.244.62a.6.6 0 0 1 .332 1.024l-3.07 2.99a.6.6 0 0 0-.173.531l.725 4.224a.6.6 0 0 1-.87.633l-3.795-1.996a.6.6 0 0 0-.559 0l-3.795 1.996a.6.6 0 0 1-.87-.633l.724-4.224a.6.6 0 0 0-.172-.531l-3.07-2.99a.6.6 0 0 1 .331-1.024l4.245-.62a.6.6 0 0 0 .45-.328z" fill="#5B4E96" /></svg>

                                        </li>
                                    ))}
                                </ul>
                                <p className="epob-review_title">"{item.text}"</p>
                                <div className="epob-review_author">
                                    <div className="epob-review_author-img">
                                        <img src={item.img} alt="" />
                                    </div>
                                    <div className="epob-review_author-info">
                                        <h4 className="epnb-author_name">{item.author}</h4>
                                        <h5 className="epob-author_company-name">{item.company}</h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <ul className="slider-dots">
                        {testimonials.map((_, index) => (
                            <li key={index} onClick={() => goToSlide(index)}>
                                <button
                                    className={index === current ? 'active' : ''}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSlider;
