import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import useSparePartUnit from "../../hook/sparePartUnit.hook";

function InventoryListPage() {
  const { unitWithBatch } = useSparePartUnit();

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Inventory List by Batch
      </Typography>

      {unitWithBatch.length === 0 && (
        <Typography>No spare part units found.</Typography>
      )}

      {unitWithBatch.map((batch) => (
        <Card key={batch.batchId} variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Batch ID: {batch.batchId}
            </Typography>
            <List>
              {batch.units.map((unit) => (
                <div key={unit._id}>
                  <ListItem disablePadding sx={{ py: 1, px: 2 }}>
                    <Box sx={{ width: "100%" }}>
                      <Typography variant="subtitle1">
                        Serial Number: {unit.serialNumber}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Technician ID: {unit.technicianId}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Status: {unit.status}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Updated At: {new Date(unit.updatedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default InventoryListPage;
