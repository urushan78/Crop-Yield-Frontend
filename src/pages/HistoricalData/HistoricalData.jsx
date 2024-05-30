import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTable, useFilters } from "react-table";
import CSVReader from "react-csv-reader";
import Select from "react-select";
import "./HistoricalData.css";

const HistoricalData = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ Year: "", District: "", Crop: "" });

  useEffect(() => {
    // Fetch CSV data and populate the data state
    const fetchData = async () => {
      try {
        const response = await fetch("he.csv");
        const csvData = await response.text();

        // Split the CSV data into rows
        const rows = csvData.split("\n");

        // Extract the header row
        const header = rows[0].split(",");

        // Extract the data rows
        const dataRows = rows.slice(1);

        // Map the rows to an array of objects using the header as keys
        const formattedData = dataRows.map((row) => {
          const values = row.split(",");
          return header.reduce(
            (obj, key, index) => ({
              ...obj,
              [key]: values[index],
            }),
            {}
          );
        });

        setData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (selectedOption, column) => {
    const { value } = selectedOption;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column.Header]: value,
    }));
  };

  useEffect(() => {
    // Apply filters to the data
    let filteredResult = data;

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filteredResult = filteredResult.filter((row) =>
          row[key]?.toLowerCase().includes(value.toString().toLowerCase())
        );
      }
    });

    setFilteredData(filteredResult);
  }, [filters, data]);

  const yearOptions = Array.from(
    { length: 2014 - 1982 + 1 },
    (_, i) => 1982 + i
  ).map((year) => ({
    value: year,
    label: year.toString() + "/" + (year + 1),
  }));

  const cropOptions = ["Barley", "Maize", "Millet", "Paddy", "Wheat"].map(
    (crop) => ({
      value: crop,
      label: crop,
    })
  );

  const districtOptions = [
    "Achham",
    "Arghakhanchi",
    "Baglung",
    "Baitadi",
    "Bajhang",
    "Bajura",
    "Banke",
    "Bara",
    "Bardiya",
    "Bhaktapur",
    "Bhojpur",
    "Chitwan",
    "Dadeldhura",
    "Dailekh",
    "Dang",
    "Darchula",
    "Dhading",
    "Dhankuta",
    "Dhanusa",
    "Dolakha",
    "Dolpa",
    "Doti",
    "Gorkha",
    "Gulmi",
    "Humla",
    "Ilam",
    "Jajarkot",
    "Jhapa",
    "Jumla",
    "Kailali",
    "Kalikot",
    "Kanchanpur",
    "Kapilbastu",
    "Kaski",
    "Kathmandu",
    "Kavre",
    "Khotang",
    "Lalitpur",
    "Lamjung",
    "Mahottari",
    "Makwanpur",
    "Manang",
    "Morang",
    "Mugu",
    "Mustang",
    "Myagdi",
    "Nawalparasi",
    "Nuwakot",
    "Okhaldhunga",
    "Palpa",
    "Panchthar",
    "Parbat",
    "Parsa",
    "Pyuthan",
    "Ramechhap",
    "Rasuwa",
    "Rautahat",
    "Rolpa",
    "Rukum",
    "Rupandehi",
    "Salyan",
    "Sankhuwasabha",
    "Saptari",
    "Sarlahi",
    "Sindhuli",
    "Sindhupalchok",
    "Siraha",
    "Solukhumbu",
    "Sunsari",
    "Surkhet",
    "Syangja",
    "Tanahu",
    "Taplejung",
    "Tehrathum",
    "Udayapur",
  ].map((district) => ({
    value: district,
    label: district,
  }));

  return (
    <div>
      <h1 className="heading">Historical data</h1>
      {/* Filters */}
      <div className="filter">
        <button className="back">
          <Link to="/" style={{ textDecoration: "none" }}>
            Back
          </Link>
        </button>
        <label className="filter-label">Year:</label>
        <Select
          styles={{
            option: (provided) => ({
              ...provided,
              color: "black",
            }),
          }}
          options={[{ value: "", label: "All" }, ...yearOptions]}
          value={yearOptions.find((option) => option.value === filters.Year)}
          onChange={(selectedOption) =>
            handleFilterChange(selectedOption, { Header: "Year" })
          }
        />
        <label className="filter-label">District:</label>
        <Select
          styles={{
            option: (provided) => ({
              ...provided,
              color: "black",
            }),
          }}
          options={[{ value: "", label: "All" }, ...districtOptions]}
          value={districtOptions.find(
            (option) => option.value === filters.District
          )}
          onChange={(selectedOption) =>
            handleFilterChange(selectedOption, { Header: "District" })
          }
        />
        <label className="filter-label">Crop:</label>
        <Select
          styles={{
            option: (provided) => ({
              ...provided,
              color: "black",
            }),
          }}
          options={[{ value: "", label: "All" }, ...cropOptions]}
          value={cropOptions.find((option) => option.value === filters.Crop)}
          onChange={(selectedOption) =>
            handleFilterChange(selectedOption, { Header: "Crop" })
          }
        />
      </div>

      {/* Table */}
      <table className="table">
        {/* Table header */}
        <thead>
          <tr>
            <th>Fiscal Year</th>
            <th>District</th>
            <th>Crop</th>
            <th>Precipitation(mm)</th>
            <th>Temperature Range(C)</th>
            <th>Area(ha)</th>
            <th>Relative Humidity(%)</th>
            <th>Surface Pressure(kPa)</th>
            <th>Specific Humidity(g/kg)</th>
            <th>Production(mt)</th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {/* Iterate over the filteredData array and display each row */}
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{row.Year + "/" + (Number(row.Year) + 1)}</td>
              <td>{row.District}</td>
              <td>{row.Crop}</td>
              <td>{Number(row["Precipitation(mm)"]).toFixed(2)}</td>
              <td>{Number(row["Temp_Range(C)"]).toFixed(2)}</td>
              <td>{Number(row["Area(ha)"]).toFixed(2)}</td>
              <td>{Number(row["Relative_Humidity(%)"]).toFixed(2)}</td>
              <td>{Number(row["Surface_Pressure(kPa)"]).toFixed(2)}</td>
              <td>{Number(row["Specific_Humidity(g/kg)"]).toFixed(2)}</td>
              <td>{Number(row["Production(mt)"]).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoricalData;
