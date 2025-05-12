const ProAlert = ({ setShowProAlert }) => {
    return (
        <div className="epob-pro-alert-popup">
            <div className="alert__wrap">
                <div className="alert__card">
                    <img
                        src="https://embedpress.test/wp-content/plugins/embedpress/EmbedPress/Ends/Back/Settings/assets/img/alert.svg"
                        alt="Alert"
                    />
                    <h2>Oops...</h2>
                    <p>
                        You need to upgrade to the{" "}
                        <a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank" rel="noreferrer">
                            Premium
                        </a>{" "}
                        Version to use this feature.
                    </p>
                    <button className="button radius-10" onClick={() => setShowProAlert(false)}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProAlert;
