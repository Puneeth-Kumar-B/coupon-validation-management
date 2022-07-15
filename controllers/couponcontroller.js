const coupon = require('../models/couponmodel')


//COUPON CREATION

const createCoupon = async(req, res) => {
    try {
        let { offerName, couponCode } = req.body;

        const couponExist = await coupon.findOne({ $or: [{ offerName: offerName }, { couponCode: couponCode }] });
        if (couponExist) {
            return res.status(200).json({ message: "Coupon Code Already Exists" });
        } else {
            const Coupon = new coupon({
                offerName: req.body.offerName,
                couponCode: req.body.couponCode,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                discount: req.body.discount,
                amount: req.body.amount,
                status: req.body.status
            });

            const couponCreation = await Coupon;
            if (couponCreation) {
                couponCreation.save();
                return res.status(200).json({ message: "Coupon Created Successfully :)" });
            }
        }
    } catch (err) {
        console.log(err);
    }
}


// COUPON UPDATION THROUGH ID

const updateCoupon = async(req, res) => {
    try {
        const couponExist = await coupon.findOne({ couponCode: req.body.couponCode, _id: { $ne: req.params.id } });
        if (couponExist) {
            return res.status(200).json({ message: "Coupon Details Already Exists" });
        } else {
            const updated_coupon = await coupon.findOneAndUpdate({ _id: req.params.id }, {
                $set: {
                    offerName: req.body.offerName,
                    couponCode: req.body.couponCode,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    discount: req.body.discount,
                    amount: req.body.amount,
                    status: req.body.status
                }
            }, { new: true });
            return res.status(200).json({ message: 'Coupon details updated', updated_coupon });
        }
    } catch (err) {
        console.log('Details not found!!')
    }
}


// COUPON DELETION THROUGH ID

const deleteCoupon = async(req, res) => {
    try {
        await coupon.findByIdAndDelete(req.params.id)
        if (!req.params.id) {
            return res.status(404).json({ error: "Coupon not found" })
        }
        return res.status(200).json({ message: "Coupon Deleted" })
    } catch (err) {
        console.log(err)
    }
}


// OBTAINING COUPON THROUGH ID

const getCoupon = async(req, res) => {
    try {
        const get_coupon = await coupon.findById(req.params.id)
        if (!req.params.id) {
            return res.status(404).json({ error: "Coupon not found" })
        }
        return res.status(200).json(get_coupon)
    } catch (err) {
        console.log(err)
    }
}


// COUPON SEARCHING

const searchCoupon = async(req, res) => {
    const { search, status } = req.query

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const start = (page - 1) * limit
    const end = page * limit

    const results = {}

    if (start > 0) {
        results.previous = {
            page: page - 1
        }
    }

    results.coupons = await coupon.find({
        $and: [({
            $or: [
                { offerName: { $regex: `${search}`, $options: "i" } },
                { couponCode: { $regex: `${search}`, $options: "i" } }
            ]
        }), { status: { $in: [status] } }]
    }).sort({ offerName: 1 }).limit(limit).skip(start).exec()

    if (end < await coupon.countDocuments().exec()) {
        results.next = {
            page: page + 1
        }
    }
    if (!results.coupons) {
        return res.status(404).json({ error: "No results found" })
    }
    return res.status(200).json(results)
}


module.exports = { createCoupon, updateCoupon, deleteCoupon, getCoupon, searchCoupon }