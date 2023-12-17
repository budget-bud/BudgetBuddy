"use client";
import React, { useEffect, useState } from "react";
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
import { IKPI } from "@/types/types";

const KPIPage = () => {
  const [data, setData] = useState<IKPI>({
    allTransCount: 0,
    allUsersCount: 0,
    allChatsCount: 0,
    weeklyKPI: [],
    dailyKPI: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("/api/kpi")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="animate-pulse">
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
                All Registered Transactions
              </Typography>
              <Typography variant="h4" style={{ color: "#FFFFFF" }}>
                {isLoading == false ? data.allTransCount : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: "#53b5ed" }}>
            <CardContent>
              <PeopleIcon style={{ fontSize: 40, color: "#FFFFFF" }} />
              <Typography
                variant="h6"
                gutterBottom
                style={{ color: "#FFFFFF" }}
              >
                All Users
              </Typography>
              <Typography variant="h4" style={{ color: "#FFFFFF" }}>
                {isLoading == false ? data.allUsersCount : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: "#53b5ed" }}>
            <CardContent>
              <ChatIcon style={{ fontSize: 40, color: "#FFFFFF" }} />
              <Typography
                variant="h6"
                gutterBottom
                style={{ color: "#FFFFFF" }}
              >
                All Chats Started
              </Typography>
              <Typography variant="h4" style={{ color: "#FFFFFF" }}>
                {isLoading == false ? data.allChatsCount : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: "#53b5ed" }}>
            <CardContent>
              <PeopleIcon style={{ fontSize: 40, color: "#FFFFFF" }} />
              <Typography
                variant="h6"
                gutterBottom
                style={{ color: "#FFFFFF" }}
              >
                Active Users In The Last 7 Days
              </Typography>
              <Typography variant="h4" style={{ color: "#FFFFFF" }}>
                {isLoading == false ? data.weeklyKPI[0].active_users_count : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: "#53b5ed" }}>
            <CardContent>
              <PeopleIcon style={{ fontSize: 40, color: "#FFFFFF" }} />
              <Typography
                variant="h6"
                gutterBottom
                style={{ color: "#FFFFFF" }}
              >
                Average Actions In The Last 7 Days
              </Typography>
              <Typography variant="h4" style={{ color: "#FFFFFF" }}>
                {isLoading == false ? data.weeklyKPI[0].average_actions : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

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
              <LineChart data={data.dailyKPI}>
                <XAxis dataKey="event_date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  dataKey="active_users_per_day"
                  type="monotone"
                  name="Active Users"
                  stroke="#8884d8"
                />
                <Line
                  dataKey="average_events_per_day_per_user"
                  type="monotone"
                  name="Average Events per User"
                  stroke="#82ca9d"
                />
                <Line
                  dataKey="events_per_day"
                  type="monotone"
                  name="Events per Day"
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
