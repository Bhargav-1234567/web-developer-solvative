import React, { useEffect, useRef, useState } from "react";
import placesListJson from "../data/places.json";
import Pagination from "./Pagination";
import Loading from "./Loading";
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
const apikey = process.env.REACT_APP_API_KEY;
const getPlaceList = (numberOfPages, currentPage, searchTerm) => {
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": apikey,
      "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
    },
  };
  return fetch(
    `
https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=${numberOfPages}&offset=${currentPage}&namePrefix=${
      searchTerm || ""
    }&minPopulation=100000`,
    options
  );
};
const Table = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [placeList, setPlaceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLinks, setPageLinks] = useState(null);
  const [metaData, setMetaData] = useState({});
  const inputRef = useRef(null);

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    setPage(0);
    debounce(() => fetchData(pageSize, 0, searchValue));
  };

  const fetchData = (pageSize, page, searchTerm) => {
    setLoading(true);
    getPlaceList(pageSize || 3, page || 0, searchTerm || "")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setPlaceList(data?.data);
        setMetaData(data?.metadata);
        setPageLinks(data.links);
        setPage(page || 0);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(pageSize, page, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "/") {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleNummberOfPageChange = (e) => {
    fetchData(e, page, searchTerm);
    setPageSize(e);
  };

  const handlePageChange = (e) => {
    if (e === "next") {
      if (page >= 0) {
        setPage(page + pageSize);
        fetchData(pageSize, page + pageSize, searchTerm);
      }
    } else if (e === "prev") {
      setPage(page - pageSize);
      fetchData(pageSize, page - pageSize, searchTerm);
    }
  };

  return (
    <>
      <div id="search-box-with-label">
        <label>Ctrl + /</label>
        <input
          ref={inputRef}
          placeholder="Search places..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="table-container">
        {loading ? <Loading /> : null}
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>First</th>
              <th>Last</th>
              <th>Handle</th>
            </tr>
          </thead>
          <tbody>
            {placeList?.map((item, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.city}</td>
                  <td>{item.country}</td>
                  <td>
                    <img
                      loading="lazy"
                      src={`https://flagsapi.com/${item.countryCode}/shiny/64.png`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {placeList?.length !== 0 && (
        <Pagination
          numberOfPages={metaData?.totalCount / pageSize}
          handleNummberOfPageChange={handleNummberOfPageChange}
          handlePageChange={handlePageChange}
          metaData={metaData}
          page={page}
          pageSize={pageSize}
        />
      )}
    </>
  );
};

export default Table;
