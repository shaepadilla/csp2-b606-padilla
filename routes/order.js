const express = require("express");
const orderController = require("../controllers/order");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

router.post("/checkout", verify, orderController.checkout);

router.get("/my-orders", verify, orderController.getMyOrders);

router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

router.put("/:orderId", verify, orderController.updateOrderStatus);

router.get("/:orderId", verify, orderController.getOrderDetails);

module.exports = router;