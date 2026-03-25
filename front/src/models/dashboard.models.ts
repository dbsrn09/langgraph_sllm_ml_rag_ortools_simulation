export interface ISourceChart {
    title: string;
    summaries: IChartSummaries[];
    filters: IChartFilters[];
    charts: IChartDatasets[];
    chart: string;
    chat_id: string;
}


export interface IChartFilters {
    title: string;
    field: string;
}

export interface IChartSummaries extends IChartFilters {
    method: string;
}

export interface IChartDatasets {
    name: string,
    type: string,
    data_x: any,
    data_y: any;
    data_z: any;
    data_labels: any;
    data_values: any;
}
