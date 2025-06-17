import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import Chart from "react-apexcharts";
import { Box, Stack } from "@mui/material";
import useReport from "../../hook/report.hook";

const chartOptions = {
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth" as const,
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  title: {
    text: "Total cost",
    align: "center" as const,
  },
};

const optionsSpark = (title: string, subtitle: string) => ({
  chart: {
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    curve: "smooth" as const,
  },
  fill: {
    opacity: 0.3,
  },

  yaxis: {
    show: false,
  },
  title: {
    text: title,
    offsetX: 0,
    style: {
      fontSize: "24px",
    },
  },
  subtitle: {
    text: subtitle,
    offsetX: 0,
    style: {
      fontSize: "14px",
    },
  },
});


const sumCount = (data: number[]) => {
  return data.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
};

function DashboardPage() {
  const { assignmentCost, inventoryCost, count } = useReport();

  return (
    <>
      <TitleBox title="Dashboard" />
      <ContentBox padding>
        <Box>
          <Stack
            direction={"row"}
            justifyContent={"space-around"}
            width={"100%"}
            mb={8}
          >
            <Chart
              options={optionsSpark(
                `${sumCount(count.assignment)} Order`,
                `Total assignment`
              )}
              series={[
                {
                  name: "Count",
                  data: count.assignment,
                },
              ]}
              type="area"
              height={160}
            ></Chart>

            <Chart
              options={optionsSpark(
                `${sumCount(count.inventory)} Order`,
                `Total stock-in`
              )}
              series={[
                {
                  data: count.inventory,
                },
              ]}
              type="area"
              height={160}
            ></Chart>

            <Chart
              options={optionsSpark(`${sumCount(assignmentCost)} THB`, `Total assignment cost`)}
              series={[
                {
                  data: [0, 40, 28, 51, 42, 109, 100, 110],
                },
              ]}
              type="area"
              height={160}
            ></Chart>
          </Stack>
          <Chart
            options={chartOptions}
            series={[
              {
                name: "Assignment cost",
                data: assignmentCost,
              },
              {
                name: "Stock-in cost",
                data: inventoryCost,
              },
            ]}
            type="area"
            height={350}
          />
        </Box>
      </ContentBox>
    </>
  );
}

export default DashboardPage;
