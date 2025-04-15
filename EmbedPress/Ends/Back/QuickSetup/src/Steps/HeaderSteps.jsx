import Power from "../Icons/Power";
import Rocket from "../Icons/Rocket";
import Settings from "../Icons/Settting";
import Upgrade from "../Icons/Upgrade";

const steps = [
    { icon: <Rocket />, id: 1 },
    { icon: <Settings />, id: 2 },
    { icon: <Power />, id: 3 },
    { icon: <Upgrade />, id: 4 },
];

const HeaderSteps = ({ step, setStep }) => {

    console.log({step});

    return (
        <header className="section epob-header_section">
            <div className="epob-container">
                <div className="epob-header_wrapper">
                    <div className="epob-row">
                        <div className="epob-col_3">
                            <div className="epob-logo_wrapper">
                                <img src="./img/embedpress-logo.jpg" alt="EmbedPress Logo" />
                            </div>
                        </div>

                        <div className="epob-col_6">
                            <div className="epob-step_wrapper">
                                <ul className="epob-step_list">
                                    {steps.map((item, index) => {
                                        const isCompleted = item.id < step;
                                        const isActive = item.id === step;

                                        const itemClasses = [
                                            "epob-step_list-item",
                                            isCompleted && "epob-completed",
                                            isActive && "epob-active_page",
                                        ]
                                            .filter(Boolean)
                                            .join(" ");

                                        return (
                                            <li
                                                key={item.id}
                                                className={itemClasses}
                                                onClick={() => setStep(item.id)}
                                                role="button"
                                            >
                                                <a>{item.icon}</a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        <div className="epob-col_3">
                            <div className="epob-version_wrapper">
                                <h4 className="epob-version">
                                    <span>Core Version: </span>
                                    <span className="epob-version_name">V4.0.1</span>
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderSteps;
