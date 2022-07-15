const coupon = require('../models/couponmodel')
const express = require("express");
const { Validations } = require("../validations/couponvalidator");
const router = express.Router();
const Controller = require('../controllers/couponcontroller')


//GETTING ALL THE COUPONS PRESENT IN DATABASE

router.get('/', async(req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const allCoupons = {}

        if (start > 0) {
            allCoupons.previous = {
                page: page - 1
            }
        }

        allCoupons.coupons = await coupon.find().limit(limit).skip(start).exec()

        if (end < await coupon.countDocuments().exec()) {
            allCoupons.next = {
                page: page + 1
            }
        }

        return res.status(200).json(allCoupons)

    } catch (err) {
        console.log(err)
    }
})


router.post("/create", Validations, Controller.createCoupon)
router.get('/search', Controller.searchCoupon)
router.get('/:id', Controller.getCoupon)
router.put('/update/:id', Validations, Controller.updateCoupon)
router.delete('/delete/:id', Controller.deleteCoupon)


module.exports = router;