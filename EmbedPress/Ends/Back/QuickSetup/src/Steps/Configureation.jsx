import HeaderSteps from "./HeaderSteps";
import Navigation from "./Navigation";

const Configuration = ({ step, setStep }) => {
    return (
        <>

            <HeaderSteps step={step} setStep={setStep} />

            <section className="section epob-configuration_section">
                <div className="epob-container">
                    <div className="epob-configuration_header-wrapper">
                        <h2 className="epob-header">Complete Basic Configuration</h2>
                        <p className="epob-title">
                            Setup global embedding settings, you can update them anytime from
                            EmbedPress dashboard
                        </p>
                    </div>
                    <div className="epob-configur_wrapper">
                        <div className="epob-setting_wrapper">
                            <h3 className="epob-settion_header">Global Embed Settings</h3>
                            <div className="epob-setting">
                                <div className="epob-row_style">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Embed iFrame Width</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#">
                                            <input
                                                type="number"
                                                placeholder={600}
                                                id="WidthPxInput"
                                                className="epob-64_px"
                                            />
                                            <label htmlFor="number">px</label>
                                        </form>
                                    </div>
                                </div>
                                <div className="epob-row_style">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Embed iFrame Height</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#">
                                            <input
                                                type="number"
                                                placeholder={550}
                                                id="HeightPxInput"
                                                className="epob-64_px"
                                            />
                                            <label htmlFor="number">px</label>
                                        </form>
                                    </div>
                                </div>
                                <div className="epob-row_style">
                                    <div className="flex-1">
                                        <h4 className="epob-title">PDF Custom Color</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label htmlFor="" className="epob-on_off">
                                                OFF
                                            </label>
                                            <label className="epob-switch">
                                                <input type="checkbox" />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label htmlFor="" className="epob-on_off">
                                                ON
                                            </label>
                                        </form>
                                    </div>
                                </div>
                                <div className="epob-row_style">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Powered by EmbedPress</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label htmlFor="" className="epob-on_off">
                                                OFF
                                            </label>
                                            <label className="epob-switch">
                                                <input type="checkbox" />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label htmlFor="" className="epob-on_off">
                                                ON
                                            </label>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="epob-pro_embedding-features_wrapper">
                            <h3 className="epob-settion_header">Pro Embedding Features</h3>
                            <div className="epob-pro_features">
                                <div className="epob-row_style epob-positon_relative">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Lazy Load</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label htmlFor="" className="epob-on_off">
                                                OFF
                                            </label>
                                            <label className="epob-switch">
                                                <input type="checkbox" disabled="" />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label htmlFor="" className="epob-on_off">
                                                ON
                                            </label>
                                        </form>
                                    </div>
                                    <div className="epob-inactive_overlay" />
                                </div>
                                <div className="epob-row_style epob-positon_relative ">
                                    <div className="flex-1">
                                        <h4 className="epob-title">YouTube Custom Branding </h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label htmlFor="" className="epob-on_off">
                                                OFF
                                            </label>
                                            <label className="epob-switch">
                                                <input type="checkbox" disabled="" />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label htmlFor="" className="epob-on_off">
                                                ON
                                            </label>
                                        </form>
                                    </div>
                                    <div className="epob-inactive_overlay" />
                                </div>
                                <div className="epob-row_style epob-positon_relative">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Vimeo Custom Branding</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label htmlFor="" className="epob-on_off">
                                                OFF
                                            </label>
                                            <label className="epob-switch">
                                                <input type="checkbox" disabled="" />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label htmlFor="" className="epob-on_off">
                                                ON
                                            </label>
                                        </form>
                                    </div>
                                    <div className="epob-inactive_overlay" />
                                </div>
                                <div className="epob-row_style epob-positon_relative">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Wistia Custom Branding&nbsp;</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label htmlFor="" className="epob-on_off">
                                                OFF
                                            </label>
                                            <label className="epob-switch">
                                                <input type="checkbox" disabled="" />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label htmlFor="" className="epob-on_off">
                                                ON
                                            </label>
                                        </form>
                                    </div>
                                    <div className="epob-inactive_overlay" />
                                </div>
                                <div className="epob-row_style epob-positon_relative">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Vimeo Custom Branding</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label htmlFor="" className="epob-on_off">
                                                OFF
                                            </label>
                                            <label className="epob-switch">
                                                <input type="checkbox" disabled="" />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label htmlFor="" className="epob-on_off">
                                                ON
                                            </label>
                                        </form>
                                    </div>
                                    <div className="epob-inactive_overlay" />
                                </div>
                                <div className="epob-row_style epob-positon_relative">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Twitch Custom Branding</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label htmlFor="" className="epob-on_off">
                                                OFF
                                            </label>
                                            <label className="epob-switch">
                                                <input type="checkbox" disabled="" />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label htmlFor="" className="epob-on_off">
                                                ON
                                            </label>
                                        </form>
                                    </div>
                                    <div className="epob-inactive_overlay" />
                                </div>
                                <div className="epob-row_style epob-positon_relative">
                                    <div className="flex-1">
                                        <h4 className="epob-title">
                                            Dailymotion Custom Branding&nbsp;
                                        </h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label htmlFor="" className="epob-on_off">
                                                OFF
                                            </label>
                                            <label className="epob-switch">
                                                <input type="checkbox" disabled="" />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label htmlFor="" className="epob-on_off">
                                                ON
                                            </label>
                                        </form>
                                    </div>
                                    <div className="epob-inactive_overlay" />
                                </div>
                                <div className="epob-row_style epob-positon_relative">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Document Custom Branding </h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label htmlFor="" className="epob-on_off">
                                                OFF
                                            </label>
                                            <label className="epob-switch">
                                                <input type="checkbox" disabled="" />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label htmlFor="" className="epob-on_off">
                                                ON
                                            </label>
                                        </form>
                                    </div>
                                    <div className="epob-inactive_overlay" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Navigation
                        step={step}
                        setStep={setStep}
                        backLabel={'Previous'}
                        nextLabel={'Next'}
                    />
                </div>
            </section>
        </>

    )
}

export default Configuration;