import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import YearDropDown from "../../components/yearDropDown";
import GSlider from "../../components/InputSlider";
import RadioGroup from "../../components/RadioGroup";
import axios from "axios";
import { districtData } from "./districtData";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// import { faker } from "https://cdn.skypack.dev/@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// let fakeData = {
//   labels,
//   datasets: [
//     {
//       label: "Dataset 1",
//       data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
//       borderColor: "rgb(255, 99, 132)",
//       backgroundColor: "rgba(255, 99, 132, 0.5)",
//     },
//     {
//       label: "Dataset 2",
//       data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
//       borderColor: "rgb(53, 162, 235)",
//       backgroundColor: "rgba(53, 162, 235, 0.5)",
//     },
//   ],
// };

const GraphView = () => {
  const [selectedOption, setSelectedOption] = useState("Year vs Production");

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [precipitation, setPrecipitation] = useState(0);
  const [area, setArea] = useState(0);
  const [temperatureRange, setTemperatureRange] = useState(0);
  const [relativeHumidity, setRelativeHumidity] = useState(0);
  const [surfacePressure, setSurfacePressure] = useState(0);
  const [specificHumidity, setSpecificHumidity] = useState(0);

  const [predictions, setPredictions] = useState([]);
  const [hasPredictionsArrived, setHasPredictionsArrived] = useState(false);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Line Chart for Production",
      },
    },
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const isDisabled = (option) => {
    return option === selectedOption;
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleCropChange = (crop) => {
    setSelectedCrop(crop);
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);

    axios
      .get("averages.json")
      .then((response) => {
        const averages = response.data;

        const precipitationAverage = averages["Precipitation(mm)"][district];
        const temperatureRangeAverage = averages["Temp_Range(C)"][district];
        const relativeHumidityAverage =
          averages["Relative_Humidity(%)"][district];
        const surfacePressureAverage =
          averages["Surface_Pressure(kPa)"][district];
        const specificHumidityAverage =
          averages["Specific_Humidity(g/kg)"][district];

        setPrecipitation(precipitationAverage);
        setTemperatureRange(temperatureRangeAverage);
        setRelativeHumidity(relativeHumidityAverage);
        setSurfacePressure(surfacePressureAverage);
        setSpecificHumidity(specificHumidityAverage);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePrecipitationChange = (value) => {
    setPrecipitation(value.x);
  };

  const handleAreaChange = (value) => {
    setArea(value.x);
  };

  const handleTemperatureRangeChange = (value) => {
    setTemperatureRange(value.x);
  };

  const handleRelativeHumidityChange = (value) => {
    setRelativeHumidity(value.x);
  };

  const handleSurfacePressureChange = (value) => {
    setSurfacePressure(value.x);
  };

  const handleSpecificHumidityChange = (value) => {
    setSpecificHumidity(value.x);
  };

  const xRange = (option) => {
    if (option == "Year vs Production") {
      const yearValues = [];
      for (let i = 1980; i <= 2015; i += 1) {
        yearValues.push(i);
      }
      return yearValues;
    } else if (option == "Precipitation vs Production") {
      const precipitationValues = [];
      for (let i = 75; i <= 2600; i += 100) {
        precipitationValues.push(i);
      }
      return precipitationValues;
    } else if (option == "Area vs Production") {
      const areaValues = [];
      for (let i = 1; i <= 100000; i += 1000) {
        areaValues.push(i);
      }
      return areaValues;
    } else if (option == "Temperature Range vs Production") {
      const temperatureRangeValues = [];
      for (let i = 5; i <= 20; i += 0.25) {
        temperatureRangeValues.push(i);
      }
      return temperatureRangeValues;
    } else if (option == "Relative Humidity vs Production") {
      const relativeHumidityValues = [];
      for (let i = 40; i <= 70; i += 0.25) {
        relativeHumidityValues.push(i);
      }
      return relativeHumidityValues;
    } else if (option == "Surface Pressure vs Production") {
      const surfacePressureValues = [];
      for (let i = 70; i <= 100; i += 0.25) {
        surfacePressureValues.push(i);
      }
      return surfacePressureValues;
    } else if (option == "Specific Humidity vs Production") {
      const specificHumidityValues = [];
      for (let i = 6; i <= 13; i += 0.25) {
        specificHumidityValues.push(i);
      }
      return specificHumidityValues;
    }
  };

  const getFormDataKey = (option) => {
    const seperated_option = option.split(" ");
    if (seperated_option.length == 3) {
      return seperated_option[0].toLowerCase();
    } else if (seperated_option.length == 4) {
      return seperated_option[0]
        .toLowerCase()
        .concat("_")
        .concat(seperated_option[1].toLowerCase());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setHasPredictionsArrived(false);

    const selectedDistrictData = districtData.find((data) => {
      return data.District === selectedDistrict;
    });
    const latitude = selectedDistrictData.Latitude;
    const longitude = selectedDistrictData.Longitude;

    const crops = ["Barley", "Maize", "Millet", "Paddy", "Wheat"];
    const cropValues = crops.reduce((obj, crop) => {
      obj[crop] = crop === selectedCrop ? 1 : 0;
      return obj;
    }, {});

    const xAxisValues = xRange(selectedOption);

    const formData = new FormData();
    formData.append("year", selectedYear);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("precipitation", precipitation);
    formData.append("temp_range", temperatureRange);
    formData.append("area", area);
    formData.append("crop_barley", cropValues.Barley);
    formData.append("crop_maize", cropValues.Maize);
    formData.append("crop_millet", cropValues.Millet);
    formData.append("crop_paddy", cropValues.Paddy);
    formData.append("crop_wheat", cropValues.Wheat);
    formData.append("relative_humidity", relativeHumidity);
    formData.append("surface_pressure", surfacePressure);
    formData.append("specific_humidity", specificHumidity);

    console.log(xAxisValues);

    setLoading(true);
    const predictions = await Promise.all(
      xAxisValues.map(async (xValue) => {
        const clonedFormData = new FormData();
        for (const [key, value] of formData.entries()) {
          clonedFormData.append(key, value);
        }
        clonedFormData.set(getFormDataKey(selectedOption), xValue);

        try {
          const response = await axios.post(
            "http://localhost:8000/predict/",
            clonedFormData
          );
          return response.data.prediction;
        } catch (error) {
          console.log(error);
          return null;
        }
      })
    );
    setHasPredictionsArrived(true);

    setPredictions(predictions.filter((prediction) => prediction !== null));
    console.log(predictions);

    const updatedChartData = {
      labels: xAxisValues,
      datasets: [
        {
          label: selectedOption.toString(),
          data: predictions,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
    setChartData(updatedChartData);
    setLoading(false);
  };

  return (
    <div>
      <h1 className="heading">Graph View</h1>
      <RadioGroup
        options={[
          "Year vs Production",
          "Precipitation vs Production",
          "Area vs Production",
          "Temperature Range vs Production",
          "Relative Humidity vs Production",
          "Surface Pressure vs Production",
          "Specific Humidity vs Production",
        ]}
        selectedOption={selectedOption}
        onOptionChange={handleOptionChange}
      />
      <div className="container">
        <div className="selectors">
          <form onSubmit={handleSubmit}>
            <YearDropDown
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              selectedCrop={selectedCrop}
              onCropChange={handleCropChange}
              selectedDistrict={selectedDistrict}
              onDistrictChange={handleDistrictChange}
              isYearDisabled={selectedOption == "Year vs Production"}
            />

            <div className="one-input">
              <label htmlFor="precipitation" className="selector-title">
                Precipitation(mm)
              </label>
              <GSlider
                value={precipitation}
                min={80}
                max={2500}
                step={5}
                onChange={handlePrecipitationChange}
                disabled={isDisabled("Precipitation vs Production")}
              />
              <span>{precipitation}</span>
            </div>

            <div className="one-input">
              <label htmlFor="temperatureRange" className="selector-title">
                Temperature Range(Celsius)
              </label>
              <GSlider
                value={temperatureRange}
                min={5}
                max={20}
                step={0.1}
                onChange={handleTemperatureRangeChange}
                disabled={isDisabled("Temperature Range vs Production")}
              />
              <span>{temperatureRange}</span>
            </div>

            <div className="one-input">
              <label htmlFor="Area" className="selector-title">
                Area(hectare)
              </label>
              <GSlider
                value={area}
                min={0}
                max={120000}
                step={5}
                onChange={handleAreaChange}
                disabled={isDisabled("Area vs Production")}
              />
              <span>{area}</span>
            </div>

            <div className="one-input">
              <label htmlFor="relativeHumidity" className="selector-title">
                Relative Humidity (%)
              </label>
              <GSlider
                value={relativeHumidity}
                min={0}
                max={100}
                step={1}
                onChange={handleRelativeHumidityChange}
                disabled={isDisabled("Relative Humidity vs Production")}
              />
              <span>{relativeHumidity}%</span>
            </div>

            <div className="one-input">
              <label htmlFor="surfacePressure" className="selector-title">
                Surface Pressure (kPa)
              </label>
              <GSlider
                value={surfacePressure}
                min={50}
                max={100}
                step={0.5}
                onChange={handleSurfacePressureChange}
                disabled={isDisabled("Surface Pressure vs Production")}
              />
              <span>{surfacePressure} kPa</span>
            </div>

            <div className="one-input">
              <label htmlFor="specificHumidity" className="selector-title">
                Specific Humidity (g/kg)
              </label>
              <GSlider
                value={specificHumidity}
                min={0}
                max={20}
                step={0.1}
                onChange={handleSpecificHumidityChange}
                disabled={isDisabled("Specific Humidity vs Production")}
              />
              <span>{specificHumidity} g/kg</span>
            </div>

            <button type="submit" className="submit-button">
              Submit
            </button>
            <br />
            <button className="historical-data-button">
              <Link to="/historical-data" style={{ textDecoration: "none" }}>
                View Historical Data
              </Link>
            </button>
            <button className="historical-data-button">
              <Link to="/" style={{ textDecoration: "none" }}>
                Home
              </Link>
            </button>
          </form>
        </div>
        <div className="prediction">
          {hasPredictionsArrived && chartData.labels && !loading ? (
            <>
              <Line options={options} data={chartData} />
            </>
          ) : (
            <>
              {loading ? (
                <>
                  <h2>Loading...</h2>
                </>
              ) : (
                <>
                  <h2>
                    Please select required options and click submit to see
                    graph.
                  </h2>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphView;
