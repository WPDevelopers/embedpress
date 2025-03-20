<?php

namespace EmbedPress\Includes\Classes;

use \Elementor\Controls_Manager;

class Elementor_Upsell
{

    public function __construct()
    {
        add_action('elementor/editor/after_enqueue_scripts', [$this, 'elementor_upsell']);
    }
    public function Elementor_Upsale()
    {
        ?>
        <style>
            .embedpress-upsell-section {
                background: #1e1e1e;
                padding: 15px;
                border-radius: 10px;
                margin-top: 15px;
                text-align: center;
                color: white;
            }

            .embedpress-upsell-section h4 {
                margin-bottom: 10px;
            }

            .stars svg {
                cursor: pointer;
                margin: 0 3px;
            }

            .chat-button {
                display: flex;
                align-items: center;
                justify-content: center;
                background: #0073aa;
                color: white;
                border: none;
                padding: 10px;
                width: 100%;
                border-radius: 5px;
                margin-top: 10px;
                cursor: pointer;
            }

            .upgrade-box {
                margin-top: 10px;
                padding: 10px;
                background: #2a2a2a;
                border-radius: 5px;
            }

            .upgrade-link {
                display: block;
                background: #ff4d4d;
                color: white;
                padding: 8px;
                margin-top: 8px;
                border-radius: 5px;
                text-decoration: none;
            }
        </style>

        <div class="embedpress-upsell-section">
            <h4>Share Your Experience</h4>
            <div class="stars" id="embedpress-rating">
                <?php for ($i = 1; $i <= 5; $i++) : ?>
                    <svg class="star" data-rate="<?php echo $i; ?>" width="14" height="14" viewBox="0 0 14 14" fill="#B1B8C2" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.80913 4.28162L1.08747 4.82121L1.02155 4.83462C0.921766 4.86111 0.830798 4.91361 0.757938 4.98676C0.685079 5.0599 0.632937 5.15107 0.606838 5.25096C0.580738 5.35085 0.581617 5.45588 0.609384 5.55531C0.637151 5.65475 0.690811 5.74504 0.764885 5.81695L3.46105 8.44137L2.82522 12.1485L2.81763 12.2126C2.81153 12.3158 2.83296 12.4188 2.87973 12.511C2.9265 12.6032 2.99694 12.6813 3.08383 12.7373C3.17072 12.7934 3.27094 12.8253 3.37422 12.8299C3.47751 12.8344 3.58015 12.8114 3.67163 12.7633L7.00013 11.0133L10.3211 12.7633L10.3794 12.7901C10.4757 12.828 10.5803 12.8397 10.6826 12.8238C10.7848 12.808 10.881 12.7652 10.9613 12.6999C11.0416 12.6345 11.103 12.5491 11.1394 12.4522C11.1757 12.3553 11.1856 12.2504 11.168 12.1485L10.5316 8.44137L13.229 5.81637L13.2745 5.76679C13.3395 5.68674 13.3821 5.59089 13.398 5.489C13.4139 5.38712 13.4025 5.28284 13.3649 5.1868C13.3274 5.09075 13.2651 5.00637 13.1843 4.94225C13.1036 4.87813 13.0073 4.83657 12.9052 4.82179L9.18355 4.28162L7.51989 0.909955C7.47175 0.812267 7.39722 0.730005 7.30475 0.672482C7.21227 0.61496 7.10554 0.584473 6.99663 0.584473C6.88773 0.584473 6.781 0.61496 6.68852 0.672482C6.59605 0.730005 6.52152 0.812267 6.47338 0.909955L4.80913 4.28162Z" />
                    </svg>
                <?php endfor; ?>
            </div>

            <button class="chat-button">Let’s Chat</button>

            <div class="upgrade-box">
                <h5>Want to explore more?</h5>
                <p>Dive in and discover all the premium features.</p>
                <a href="https://embedpress.com/#pricing" target="_blank" class="upgrade-link">Upgrade to PRO</a>
            </div>
        </div>

        <script>

            console.log('this is come from upsell');
            document.addEventListener("DOMContentLoaded", function() {
                const stars = document.querySelectorAll("#embedpress-rating .star");

                stars.forEach(star => {
                    star.addEventListener("click", function() {
                        const rating = this.getAttribute("data-rate");
                        stars.forEach((s, index) => {
                            s.setAttribute("fill", index < rating ? "#FFD700" : "#B1B8C2");
                        });
                        alert("Thanks for rating us " + rating + " stars!");
                    });
                });

                document.querySelector(".chat-button").addEventListener("click", function() {
                    window.open("https://zoobbe.com/support", "_blank");
                });
            });
        </script>

<?php
    }
}
