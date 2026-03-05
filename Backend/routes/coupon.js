const express = require('express');
const router = express.Router();
const Coupon = require('../models/coupon');
const { protect, adminOnly } = require('../middleware/auth');

// Get all coupons (Admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching coupons' });
  }
});

// Create a new coupon (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { code, discountPercentage, expiryDate } = req.body;
    
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
       return res.status(400).json({ msg: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountPercentage,
      expiryDate
    });
    
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ msg: 'Server error creating coupon' });
  }
});

// Delete a coupon (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ msg: 'Coupon not found' });
    }
    res.json({ msg: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting coupon' });
  }
});


// Validate a coupon (Public for users to apply during booking)
router.post('/validate', protect, async (req, res) => {
  try {
      const { code } = req.body;
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      
      if(!coupon) return res.status(400).json({ msg: 'Invalid Coupon' });
      
      if(!coupon.isActive || new Date() > new Date(coupon.expiryDate)) {
          return res.status(400).json({ msg: 'Coupon has expired' });
      }
      
      res.json({ discountPercentage: coupon.discountPercentage });
      
  } catch (err) {
      res.status(500).json({ msg: 'Server error validating coupon' });
  }
});


module.exports = router;
