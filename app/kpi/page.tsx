"use client";
import React from "react";
import { Grid, Card, CardContent, Typography, Paper } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  MonetizationOn as MoneyIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";

const KPIPage = () => {
  // Generate sample data for 1 month
  const generateDataForMonth = () => {
    const currentDate = new Date();
    const data = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);

      data.push({
        date: date.toISOString().split("T")[0],
        transactions: Math.floor(Math.random() * 1000),
        users: Math.floor(Math.random() * 2000),
        chats: Math.floor(Math.random() * 500),
      });
    }

    return data.reverse();
  };

  const dataForMonth = generateDataForMonth();

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: "#53b5ed" }}>
            <CardContent>
              <MoneyIcon style={{ fontSize: 40, color: "#FFFFFF" }} />
              <Typography
                variant="h6"
                gutterBottom
                style={{ color: "#FFFFFF" }}
              >
                Transactions
              </Typography>
              <Typography variant="h4" style={{ color: "#FFFFFF" }}>
                {dataForMonth[0]?.transactions || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Box for Users */}
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: "#53b5ed" }}>
            <CardContent>
              <PeopleIcon style={{ fontSize: 40, color: "#FFFFFF" }} />
              <Typography
                variant="h6"
                gutterBottom
                style={{ color: "#FFFFFF" }}
              >
                Users
              </Typography>
              <Typography variant="h4" style={{ color: "#FFFFFF" }}>
                {dataForMonth[0]?.users || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Box for Chats */}
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: "#53b5ed" }}>
            <CardContent>
              <ChatIcon style={{ fontSize: 40, color: "#FFFFFF" }} />
              <Typography
                variant="h6"
                gutterBottom
                style={{ color: "#FFFFFF" }}
              >
                Chats
              </Typography>
              <Typography variant="h4" style={{ color: "#FFFFFF" }}>
                {dataForMonth[0]?.chats || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              style={{ color: "#3F51B5", marginBottom: 20 }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  color: "#000000",
                }}
              >
                Performance Overview
              </span>
              <br />
              <span style={{ fontSize: "0.8em", color: "#757575" }}>
                Transactions, Users, and Chats
                <br />
                Over the Last Month
              </span>
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dataForMonth}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  dataKey="transactions"
                  type="monotone"
                  name="Transactions"
                  stroke="#8884d8"
                />
                <Line
                  dataKey="users"
                  type="monotone"
                  name="Users"
                  stroke="#82ca9d"
                />
                <Line
                  dataKey="chats"
                  type="monotone"
                  name="Chats"
                  stroke="#ffc658"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default KPIPage;
