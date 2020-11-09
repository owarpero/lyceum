import React from "react";

import "antd/dist/antd.css";
import axios from "axios";
import { Table, Input, Button, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { getCookie } from "../index";

export default class Top extends React.Component {
  state = {
    searchText: "",
    searchedColumn: "",
    data: [],
  };
  async topplayers() {
    let topplayer = await axios.get(
      "https://app.kangreon.ru/liceum/getrating",
      { params: { variant: "all", nickname: "Elisha" } }
    );
    let data = [];

    for (
      let index = 0;
      index < Object.keys(topplayer.data.list).length;
      index++
    ) {
      if ([Object.keys(topplayer.data.list)][0][index] === getCookie("user")) {
        data.push({
          name: (
            <div style={{ backgroundColor: "#ffc069", padding: 0 }}>
              {getCookie("user")}
            </div>
          ),
          score: [Object.values(topplayer.data.list)][0][index],
          key: index + 1,
        });
        continue;
      }
      data.push({
        key: index + 1,
        name: [Object.keys(topplayer.data.list)][0][index],
        score: [Object.values(topplayer.data.list)][0][index],
      });
    }
    this.setState({ data });
  }
  componentDidMount() {
    this.topplayers();
  }
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Найти по имени`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Поиск
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Сбросить
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  render() {
    const columns = [
      {
        title: "Месца",
        dataIndex: "key",
        key: "key",
        width: "5%",
      },
      {
        title: "Імя карыстальніка",
        dataIndex: "name",
        key: "name",
        width: "30%",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Колькасць ачкоў",
        dataIndex: "score",
        key: "score",
        sorter: {
          compare: (a, b) => a.score - b.score,
          multiple: 1,
        },
      },
    ];
    return (
      <div ref={this.props.anchorRef}>
        <Table
          columns={columns}
          dataSource={this.state.data}
          pagination={{ pageSize: 11 }}
        />
      </div>
    );
  }
}
