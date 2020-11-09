import React, { useContext, useState, useEffect, useRef } from "react";
import "antd/dist/antd.css";
import "./Admin.css";
import { Table, Input, Button, Popconfirm, Form, Tag, message } from "antd";
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "Вопрос",
        dataIndex: "question",
        width: "200",
        fixed: "left",
        editable: true,
        ellipsis: {
          showTitle: false,
        },
      },
      {
        title: "Ссылка на изображение(только для правильного ответа)",
        dataIndex: "truthvariantimage",
        width: "30%",
        ellipsis: {
          showTitle: false,
        },
        editable: true,
      },
      {
        title: "Ссылка на Google Maps(только для правильного ответа)",
        dataIndex: "linkongooglemaps",
        width: "30%",
        ellipsis: {
          showTitle: false,
        },
        editable: true,
      },
      {
        title: "Ответы (всего 4, через запятую)",
        numonlist: "tags",
        dataIndex: "variants_set",
        editable: true,
        ellipsis: {
          showTitle: false,
        },

        render: (tags) => {
          Array.isArray(tags) ? (tags = tags) : (tags = tags.split(","));

          return (
            <>
              {tags.map((tag, index) => {
                let color = index === 0 ? "green" : "red";
                return index < 4 ? (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                ) : (
                  ""
                );
              })}
            </>
          );
        },
      },
      {
        title: "Операции",
        dataIndex: "operation",
        // fixed: "right",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.numonlist)}
            >
              <a>Удалить</a>
            </Popconfirm>
          ) : null,
      },
    ];
    this.state = {
      dataSource: [
        {
          numonlist: "",
          question: "",
          truthvariantimage: "",
          linkongooglemaps: "",
          variants_set: "",
        },
      ],
      creating: false,
      count: 1,
      loading: true,
    };
  }
  componentDidMount() {
    fetch("https://app.kangreon.ru/liceum/testprocess")
      .then((response) => response.json())
      .then((r) =>
        this.setState({
          dataSource: r,
          count: r.length + 1,
          loading: false,
        })
      );
  }
  handleDelete = (numonlist) => {
    console.log(this.state.dataSource);
    const dataSource = [...this.state.dataSource];

    let newData = dataSource.filter((item) => item.numonlist !== numonlist);

    for (let index = 0; index < newData.length; index++) {
      newData[index].numonlist = index + 1;
    }
    console.log({ id: newData[numonlist - 1].id });
    fetch("https://app.kangreon.ru/liceum/deletequestion/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: newData[numonlist - 1].id }),
    });
    this.setState({
      dataSource: newData,
    });
  };
  handleAdd = () => {
    const { count, dataSource, creating } = this.state;
    if (!creating) {
      const newData = {
        numonlist: count,
        question: ``,
        truthvariantimage: "",
        linkongooglemaps: ``,
        variants_set: "",
      };
      this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1,
        creating: !creating,
      });
    } else {
      let errors = false;

      for (const key in dataSource[dataSource.length - 1]) {
        const element = dataSource[dataSource.length - 1][key];
        if (element === "") errors = true;
      }
      if (errors) {
        message.error(
          "Проверьте правильность заполнения строк все строки должны быть заполнены"
        );
      } else {
        this.setState({
          creating: !creating,
        });
        let data = dataSource[dataSource.length - 1];

        Array.isArray(data.variants_set)
          ? (data.variants_set = data.variants_set)
          : (data.variants_set = data.variants_set.split(","));

        data.truth = data.variants_set[0];

        fetch("https://app.kangreon.ru/liceum/addquestion/", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataSource[dataSource.length - 1]),
        });
      }
    }
  };
  handleSave = (row) => {
    if (
      this.state.dataSource[row.numonlist] !== undefined ||
      !this.state.creating
    ) {
      Array.isArray(row.variants_set)
        ? (row.variants_set = row.variants_set)
        : (row.variants_set = row.variants_set.split(","));

      row.truth = row.variants_set[0];
      row.variants_set.slice(0, 5);
      fetch("https://app.kangreon.ru/liceum/updatedata/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(row),
      })
        .then((r) => r)
        .then((r) =>
          r.n === "l"
            ? message.error("все плохо(")
            : message.success(`Данные обновленны `)
        );
    }

    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.numonlist === item.numonlist);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });

    this.setState({
      dataSource: newData,
    });
  };

  render() {
    const { dataSource } = this.state;
    console.log(this.state.dataSource);
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
          loading={this.state.loading}
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: 1500 }}
        />
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            margin: 16,
          }}
        >
          {!this.state.creating ? "Добавить вопрос" : "Сохранить"}
        </Button>
        {/* <Button
          onClick={this.dispatchToServer}
          type="primary"
          style={{
            margin: 16,
          }}
        >
          Обновить все измененные данные
        </Button> */}
      </div>
    );
  }
}
