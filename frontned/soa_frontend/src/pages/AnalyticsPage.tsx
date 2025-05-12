import React, { useEffect, useState } from "react";
import { Table } from "antd";

interface Log {
  timestamp: string;
  message: string;
  level: string;
  source: string;
}

const AnalyticsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [mostVisitedRoutes, setMostVisitedRoutes] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const data: Log = JSON.parse(event.data);
      console.log("Received log:", data);
      setLogs((prevLogs) => [...prevLogs, data]);
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    fetch("http://localhost:5004/analytics/most-visited-routes")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMostVisitedRoutes(data.data);
        } else {
          console.error("Failed to fetch analytics data:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
      });
  }, []);

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
  ];

  const routeColumns = [
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
    },
    {
      title: "Visits",
      dataIndex: "count",
      key: "count",
    },
  ];

  return (
    <div>
      <h1>Analytics</h1>
      <p>
        Welcome to the Analytics Page. Here you can view various metrics and
        insights.
      </p>
      <Table dataSource={logs} columns={columns} rowKey="timestamp" />
      <h2>Most Visited Routes</h2>
      <Table
        dataSource={mostVisitedRoutes}
        columns={routeColumns}
        rowKey="route"
      />
    </div>
  );
};

export default AnalyticsPage;
