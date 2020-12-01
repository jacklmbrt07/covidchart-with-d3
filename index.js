function App() {
  const [countryData, setCountryData] = React.useState([]);
  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://disease.sh/v3/covid-19/countries");
      const data = await (await response).json();
      console.log(data);
      setCountryData(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}

function BarChart({ data, height, width, widthOfBar, dataType }) {
  React.useEffect(() => {
    createBarChart();
  }, []);

  const createBarChart = () => {
      const countryData = data.map(country => country["casesPerOneMillion"])
  };

  return (
    <div>
      <svg width={width} height={height}></svg>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
