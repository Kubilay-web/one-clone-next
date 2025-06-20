import { OrderFullJobType, OrderFulltType } from "@/lib/types";
import {
  Document,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
export const generateOrderPDFBlob = async (
  order: OrderFullJobType,
): Promise<Blob> => {
  if (!order) throw new Error("Order is required to generate the PDF.");

  // Define the pdf styles
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 12,
    },
    section: {
      marginBottom: 10,
    },
    header: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: "center",
      fontWeight: "bold",
    },
    groupHeader: {
      fontSize: 14,
      marginBottom: 5,
      fontWeight: "bold",
    },
    table: {
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#e4e4e4",
      marginBottom: 20,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCell: {
      borderWidth: 1,
      borderColor: "#e4e4e4",
      padding: 5,
      flexGrow: 1,
      overflow: "hidden", // Ensures content doesn't spill over
    },
    productName: {
      flexGrow: 2,
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden", // Truncate long names with ellipsis
      maxWidth: "100%", // Ensures it doesn't overflow
    },
  });

  // Define the PDF Document
  const OrderInvoicePdf = () => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Order Invoice</Text>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text>Order ID: {order.order_id}</Text>
          <Text>
            Order Date: {new Date(order.createdAt).toLocaleDateString()}
          </Text>
          <Text>Order Status: {order.package_name}</Text>
          <Text>Payment Status: {order.payment_status}</Text>
        </View>

        <View>
          <Text>Order Subtotal: ${order.default_amount}</Text>
          <Text>Order Total: ${order.amount}</Text>
        </View>
      </Page>
    </Document>
  );

  // Generate the PDF blob
  const pdfBlob = await pdf(<OrderInvoicePdf />).toBlob();
  return pdfBlob;
};
