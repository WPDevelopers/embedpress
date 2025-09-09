const AnalyticsSkelton = () => {

    return (
        <div className="ep-analytics-skeleton">
            {/* Overview Cards Skeleton */}
            <div className="ep-card-wrapper overview-wrapper">
                <div className="ep-card-header">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-filter"></div>
                </div>
                <div className="ep-overview-cards">
                    <div className="ep-card skeleton-card">
                        <div className="card-top">
                            <div className="skeleton-icon"></div>
                            <div className="skeleton-text-group">
                                <div className="skeleton-number"></div>
                                <div className="skeleton-label"></div>
                            </div>
                        </div>
                        <div className="skeleton-sub"></div>
                    </div>
                    <div className="ep-card skeleton-card">
                        <div className="card-top">
                            <div className="skeleton-icon"></div>
                            <div className="skeleton-text-group">
                                <div className="skeleton-number"></div>
                                <div className="skeleton-label"></div>
                            </div>
                        </div>
                        <div className="skeleton-sub"></div>
                    </div>
                    <div className="ep-card skeleton-card">
                        <div className="card-top">
                            <div className="skeleton-icon"></div>
                            <div className="skeleton-text-group">
                                <div className="skeleton-number"></div>
                                <div className="skeleton-label"></div>
                            </div>
                        </div>
                        <div className="skeleton-sub"></div>
                    </div>
                    <div className="ep-card skeleton-card">
                        <div className="card-top">
                            <div className="skeleton-icon"></div>
                            <div className="skeleton-text-group">
                                <div className="skeleton-number"></div>
                                <div className="skeleton-label"></div>
                            </div>
                        </div>
                        <div className="skeleton-sub"></div>
                    </div>
                </div>
            </div>

            {/* Main Graphs Skeleton */}
            <div className="ep-main-graphs">
                <div className="ep-card-wrapper views-chart">
                    <div className="ep-card-header">
                        <div className="tab-header-wrapper">
                            <div className="tabs">
                                <div className="skeleton-tab"></div>
                                <div className="skeleton-tab"></div>
                            </div>
                            <div className="skeleton-select"></div>
                        </div>
                    </div>
                    <div className="graph-placeholder">
                        <div className="skeleton-chart"></div>
                    </div>
                </div>
                <div className="ep-card-wrapper device-analytics">
                    <div className="ep-card-header">
                        <div className="tabs">
                            <div className="skeleton-tab"></div>
                            <div className="skeleton-tab"></div>
                        </div>
                    </div>
                    <div className="pie-placeholder">
                        <div className="button-wrapper">
                            <div className="skeleton-btn"></div>
                            <div className="skeleton-btn"></div>
                        </div>
                        <div className="skeleton-pie-chart"></div>
                    </div>
                </div>
            </div>

            {/* Tables Skeleton */}
            <div className="ep-table-wrapper">
                <div className="ep-card-wrapper refallal-wrapper-table">
                    <div className="ep-card-header">
                        <div className="skeleton-table-title"></div>
                    </div>
                    <div className="tab-table-content">
                        <div className="skeleton-table">
                            <div className="skeleton-table-header">
                                <div className="skeleton-th"></div>
                                <div className="skeleton-th"></div>
                                <div className="skeleton-th"></div>
                                <div className="skeleton-th"></div>
                            </div>
                            <div className="skeleton-table-body">
                                <div className="skeleton-tr">
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                </div>
                                <div className="skeleton-tr">
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                </div>
                                <div className="skeleton-tr">
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ep-card-wrapper analytics-wrapper-table">
                    <div className="ep-card-header">
                        <div className="tabs">
                            <div className="skeleton-tab"></div>
                            <div className="skeleton-tab"></div>
                        </div>
                    </div>
                    <div className="tab-table-content">
                        <div className="skeleton-table">
                            <div className="skeleton-table-header">
                                <div className="skeleton-th"></div>
                                <div className="skeleton-th"></div>
                                <div className="skeleton-th"></div>
                                <div className="skeleton-th"></div>
                                <div className="skeleton-th"></div>
                            </div>
                            <div className="skeleton-table-body">
                                <div className="skeleton-tr">
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                </div>
                                <div className="skeleton-tr">
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                </div>
                                <div className="skeleton-tr">
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                    <div className="skeleton-td"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnalyticsSkelton;