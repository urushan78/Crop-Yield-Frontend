import React from "react";
import Select from "react-select";
import { districts } from "./districts";
import "./yearDropDown.css";

const YearDropDown = ({
  selectedYear,
  selectedCrop,
  selectedDistrict,
  onYearChange,
  onCropChange,
  onDistrictChange,
  isYearDisabled,
}) => {
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  const districtOptions = [];

  for (let year = 1982; year <= currentYear + 5; year++) {
    yearOptions.push({
      value: year,
      label: year.toString() + "/" + (Number(year) + 1).toString(),
    });
  }

  const cropOptions = [
    { value: "Barley", label: "Barley" },
    { value: "Maize", label: "Maize" },
    { value: "Millet", label: "Millet" },
    { value: "Paddy", label: "Paddy" },
    { value: "Wheat", label: "Wheat" },
  ];

  for (let i = 0; i < districts.length; i++) {
    districtOptions.push({ value: districts[i], label: districts[i] });
  }

  const customStyles = {
    option: (provided) => ({
      ...provided,
      color: "black",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
  };

  const handleYearChange = (selectedOption) => {
    onYearChange(selectedOption.value);
  };

  const handleCropChange = (selectedOption) => {
    onCropChange(selectedOption.value);
  };

  const handleDistrictChange = (selectedOption) => {
    onDistrictChange(selectedOption.value);
  };

  return (
    <div>
      <div className="one-input">
        <label htmlFor="year" className="selector-title">
          Year
        </label>
        {selectedYear ? (
          <Select
            options={yearOptions}
            value={{
              selectedYear: selectedYear,
              label: selectedYear.toString(),
            }}
            onChange={handleYearChange}
            placeholder="Select a year"
            styles={customStyles}
            className="custom-select"
            isDisabled={isYearDisabled}
          />
        ) : (
          <Select
            options={yearOptions}
            value={selectedYear}
            onChange={handleYearChange}
            placeholder="Select a year"
            styles={customStyles}
            className="custom-select"
            isDisabled={isYearDisabled}
          />
        )}
      </div>

      <div className="one-input">
        <label htmlFor="crop" className="selector-title">
          Crop
        </label>
        {selectedCrop ? (
          <Select
            options={cropOptions}
            value={{ selectedCrop: selectedCrop, label: selectedCrop }}
            onChange={handleCropChange}
            placeholder="Select a crop"
            styles={customStyles}
            className="custom-select"
          />
        ) : (
          <Select
            options={cropOptions}
            value={selectedCrop}
            onChange={handleCropChange}
            placeholder="Select a crop"
            styles={customStyles}
            className="custom-select"
          />
        )}
      </div>

      <div className="one-input">
        <label htmlFor="district" className="selector-title">
          District:
          <br />
        </label>
        {selectedDistrict ? (
          <Select
            options={districtOptions}
            value={{
              selectedDistrict: selectedDistrict,
              label: selectedDistrict,
            }}
            onChange={handleDistrictChange}
            placeholder="Select a district"
            styles={customStyles}
            className="custom-select"
          />
        ) : (
          <Select
            options={districtOptions}
            value={selectedDistrict}
            onChange={handleDistrictChange}
            placeholder="Select a district"
            styles={customStyles}
            className="custom-select"
          />
        )}
      </div>
    </div>
  );
};

export default YearDropDown;
