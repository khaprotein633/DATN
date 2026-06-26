const jwt = require('jsonwebtoken');
const User = require('../models/userM');
const userService = require('../services/userS');

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }

        const user = await userService.getById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "Người dùng không tồn tại!" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Lỗi trong protectRoute:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

const generateToken = (_id, res) => {
    if (!process.env.JWT_SECRET) {
        throw new Error(" Lỗi: Chưa thiết lập biến môi trường JWT_SECRET_KEY");
    }

    // Tạo token
    const token = jwt.sign({ _id: _id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
    });

    // Lưu token vào cookie
    res.cookie("jwt", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 ngày
        httpOnly: true, // Bảo vệ khỏi JavaScript trên trình duyệt
        sameSite: "strict", // Ngăn CSRF
        secure: process.env.NODE_ENV === "production", // HTTPS ở production
        path: "/", // Cho phép gửi cookie với mọi request
    });

    return token;
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Chưa đăng nhập",
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Bạn không có quyền truy cập",
            });
        }

        next();
    };
};


module.exports = { protectRoute, generateToken ,authorize};