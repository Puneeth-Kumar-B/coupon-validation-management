const Joi = require('joi')


// COUPON VALIDATION

const couponValidations = Joi.object({
    offerName: Joi.string().required().min(3),

    couponCode: Joi.string().required().min(3),

    startDate: Joi.string().required(),

    endDate: Joi.string().required(),

    discount: Joi.number().required(),

    amount: Joi.number().required(),

    status: Joi.boolean().default(false).required()
})

const Validations = async(req, res, next) => {
    const Coupon = {
        offerName: req.body.offerName,
        couponCode: req.body.couponCode,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        discount: req.body.discount,
        amount: req.body.amount,
        status: req.body.status
    }

    let { error } = await couponValidations.validate(Coupon, { abortEarly: false });
    if (error) {
        return res.status(422).json({ statusCode: 422, error: error.message });
    }
    next()
}

module.exports = { Validations }