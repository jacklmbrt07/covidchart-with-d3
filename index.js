function App() {
  const [countryData, setCountryData] = React.useState([]);
  const [dataType, setDataType] = React.useState("casesPerOneMillion");
  const [widthOfBar, setWidthOfBar] = React.useState(5);
  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `https://disease.sh/v3/covid-19/countries?sort=${dataType}`
      );
      const data = await (await response).json();
      console.log(data);
      setCountryData(data);
    }
    fetchData();
  }, [dataType]);

  return (
    <div>
      <h1>Covid Stats</h1>
      <select
        name="datatype"
        id="datatype"
        onChange={(e) => setDataType(e.target.value)}
        value={dataType}
      >
        <option value="casesPerOneMillion">Cases Per One Million</option>
        <option value="cases">Total Cases</option>
        <option value="deaths">Total Deaths</option>
        <option value="tests">Total Tests</option>
        <option value="deathsPerOneMillion">Deaths Per One Million</option>
      </select>
      <br />
      <label htmlFor="widthofbar">
        Width of DataPoint
        <input
          type="number"
          name="widthofbar"
          value={widthOfBar}
          onChange={(e) => setWidthOfBar(e.target.value)}
        />
      </label>
      <div className="visHolder">
        <div className="axes">
          <BarChart
            data={countryData}
            height={500}
            width={countryData.length * widthOfBar}
            widthOfBar={widthOfBar}
            dataType={dataType}
          />
        </div>
      </div>
    </div>
  );
}

function BarChart({ data, height, width, widthOfBar, dataType }) {
  React.useEffect(() => {
    createBarChart();
  }, [data, widthOfBar]);

  const createBarChart = () => {
    const countryData = data.map((country) => country[dataType]);
    const countries = data.map((country) => country.country);

    let tooltip = d3
      .select(".visHolder")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    const dataMax = d3.max(countryData);
    const yScale = d3.scaleLinear().domain([0, dataMax]).range([0, height]);
    const xScale = d3.scaleLinear().domain([0, dataMax]).range([0, width]);

    const axis = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    d3.select("svg").selectAll("rect").data(countryData).enter().append("rect");
    d3.select("svg")
      .selectAll("rect")
      .data(countryData)
      .style("fill", (d, i) => (i % 2 == 0 ? "#0f87f7" : "#f77f0f"))
      .attr("x", (d, i) => i * widthOfBar)
      .attr("y", (d) => height - yScale(d + dataMax * 0.1))
      .attr("height", (d, i) => yScale(d + dataMax * 0.1))
      .attr("width", widthOfBar)
      .on("mouseover", (d, i) => {
        tooltip.style("opacity", 0.9);
        tooltip
          .html(countries[i] + `<br/>${dataType}:` + d)
          .style("left", i * widthOfBar + 20 + "px")
          .style("top", d3.event.pageY - 170 + "px");
      })
      .on("mouseout", (d) => {
        tooltip.style("opacity", 0);
      });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    axis.append("g").attr("transform", `translate(0, ${width})`).call(xAxis);
    axis.append("g").attr("transform", `translate(0, ${height})`).call(yAxis);
  };

  return (
    <div>
      <svg width={width} height={height}></svg>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
