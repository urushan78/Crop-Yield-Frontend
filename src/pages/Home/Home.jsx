import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import YearDropDown from "../../components/yearDropDown";
import Slider from "../../components/slider";
import axios from "axios";
import "./Home.css";
import { districtData } from "../GraphView/districtData";

const Home = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [precipitation, setPrecipitation] = useState(0);
  const [area, setArea] = useState(0);
  const [temperatureRange, setTemperatureRange] = useState(0);
  const [relativeHumidity, setRelativeHumidity] = useState(0);
  const [surfacePressure, setSurfacePressure] = useState(0);
  const [specificHumidity, setSpecificHumidity] = useState(0);

  const [prediction, setPrediction] = useState("0");

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleCropChange = (crop) => {
    setSelectedCrop(crop);
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);

    axios
      .get("averages.json") // Replace with the correct path to averages.json
      .then((response) => {
        const averages = response.data;
        // console.log(averages['Area(ha)']);

        // Get the average values for the selected district
        const precipitationAverage = averages["Precipitation(mm)"][district];
        const temperatureRangeAverage = averages["Temp_Range(C)"][district];
        const relativeHumidityAverage =
          averages["Relative_Humidity(%)"][district];
        const surfacePressureAverage =
          averages["Surface_Pressure(kPa)"][district];
        const specificHumidityAverage =
          averages["Specific_Humidity(g/kg)"][district];

        // Update the input sliders with the average values
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

  const handleSubmit = (event) => {
    event.preventDefault();

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

    console.log(formData);

    axios
      .post("http://localhost:8000/predict/", formData)
      .then((response) => {
        setPrediction(response.data.prediction);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1 className="heading">Crop Production Prediction</h1>
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
              isYearDisabled={false}
            />

            <div className="one-input">
              <label htmlFor="precipitation" className="selector-title">
                Precipitation(mm)
              </label>
              <Slider
                value={precipitation}
                min={80}
                max={2500}
                step={5}
                onChange={handlePrecipitationChange}
              />
              <span>{precipitation}</span>
            </div>

            <div className="one-input">
              <label htmlFor="temperatureRange" className="selector-title">
                Temperature Range(Celsius)
              </label>
              <Slider
                value={temperatureRange}
                min={5}
                max={20}
                step={0.1}
                onChange={handleTemperatureRangeChange}
              />
              <span>{temperatureRange}</span>
            </div>

            <div className="one-input">
              <label htmlFor="Area" className="selector-title">
                Area(hectare)
              </label>
              <Slider
                value={area}
                min={0}
                max={120000}
                step={5}
                onChange={handleAreaChange}
              />
              <span>{area}</span>
            </div>

            <div className="one-input">
              <label htmlFor="relativeHumidity" className="selector-title">
                Relative Humidity (%)
              </label>
              <Slider
                value={relativeHumidity}
                min={0}
                max={100}
                step={1}
                onChange={handleRelativeHumidityChange}
              />
              <span>{relativeHumidity}%</span>
            </div>

            <div className="one-input">
              <label htmlFor="surfacePressure" className="selector-title">
                Surface Pressure (kPa)
              </label>
              <Slider
                value={surfacePressure}
                min={50}
                max={100}
                step={0.5}
                onChange={handleSurfacePressureChange}
              />
              <span>{surfacePressure} kPa</span>
            </div>

            <div className="one-input">
              <label htmlFor="specificHumidity" className="selector-title">
                Specific Humidity (g/kg)
              </label>
              <Slider
                value={specificHumidity}
                min={0}
                max={20}
                step={0.1}
                onChange={handleSpecificHumidityChange}
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
              <Link to="/graph-view" style={{ textDecoration: "none" }}>
                View Graphs
              </Link>
            </button>
          </form>
        </div>
        <div className="prediction">
          <h2>Prediction:</h2>
          {/* {selectedYear &&
            selectedDistrict &&
            selectedCrop &&
            precipitation !== 0 &&
            temperatureRange !== 0 &&
            area !== 0 &&
            prediction && (
              <p>
                The prediction of production of {selectedCrop} in{" "}
                {selectedDistrict} district in the year {selectedYear} with
                temperature {Number(temperatureRange).toFixed(2)} degrees
                celsius, precipitation {Number(precipitation).toFixed(2)}mm and
                area {area} hectare is:
              </p>
            )} */}
          {prediction && <h2>{prediction} metric ton</h2>}
        </div>
      </div>
    </div>
  );
};

export default Home;
